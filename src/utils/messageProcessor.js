// Instagram message data processing module
import { decodeInstagramEmoji, isExternalDomain, filterMessagesByYear } from './instagramUtils.js';

// Process raw Instagram message files into stats format
export const processInstagramFiles = (instagramFiles, onProgress = null) => {
  // Combine all messages from all files
  let allMessages = [];
  let participants = [];
  
  instagramFiles.forEach(file => {
    if (participants.length === 0) {
      participants = file.data.participants.map(p => p.name);
    }
    allMessages = allMessages.concat(file.data.messages);
  });

  // Sort messages by timestamp (oldest first)
  allMessages.sort((a, b) => a.timestamp_ms - b.timestamp_ms);

  // Filter messages for current year only
  const currentYear = new Date().getFullYear();
  const currentYearMessages = filterMessagesByYear(allMessages);

  // Check if we have any messages for the current year
  if (currentYearMessages.length === 0) {
    throw new Error(
      `No messages found for ${currentYear}. This Instagram Rewind ` +
      `only shows data from the current year. Your chat data appears ` +
      `to be from a different year.`
    );
  }

  if (onProgress) {
    onProgress(`Processing ${currentYearMessages.length} messages...`, 50);
  }

  // Initialize stats object with only fields used by cards
  const stats = {
    total_messages: 0,
    per_sender: {},
    reactions_sent: {},
    reactions_received: {},
    top_reaction_emoji: {},
    emoji_in_text: {},
    reels_total: 0,
    top_domains: [],
    busiest_dow: [],
    busiest_hour: [],
    hourly_activity: new Array(24).fill(0),
    best_duo: [],
    longest_streak_days: 0,
    reply_times_median: {},
    rewind_year: currentYear // Add the year to the stats
  };

  // Initialize per-sender stats
  participants.forEach(name => {
    stats.per_sender[name] = 0;
    stats.reactions_sent[name] = 0;
    stats.reactions_received[name] = 0;
    stats.reply_times_median[name] = 0;
  });

  // Process each message (using filtered messages)
  const domainCounts = {};
  const dailyActivity = {}; // YYYY-MM-DD -> message count
  const duoCounts = {};
  const replyTimes = {};
  
  const totalMessages = currentYearMessages.length;

  currentYearMessages.forEach((message, index) => {
    // Progress reporting for large datasets (every 10% of progress)
    if (onProgress && totalMessages > 1000 && index % Math.floor(totalMessages / 10) === 0 && index > 0) {
      const progressPercent = Math.round(50 + (index / totalMessages) * 30); // 50-80% range
      onProgress(`Analyzing message ${index} of ${totalMessages}...`, progressPercent);
    }

    const sender = message.sender_name;
    if (!participants.includes(sender)) return; // Skip if sender not in participants

    // Count total messages
    stats.total_messages++;
    stats.per_sender[sender]++;

    // Process timestamp
    const date = new Date(message.timestamp_ms);
    const hour = date.getHours();
    const dateStr = date.toISOString().split('T')[0];

    // Hourly activity
    stats.hourly_activity[hour]++;

    // Daily activity for streaks
    dailyActivity[dateStr] = (dailyActivity[dateStr] || 0) + 1;

    // Process reactions received by this message
    if (message.reactions) {
      message.reactions.forEach(reaction => {
        const reactor = reaction.actor;
        if (participants.includes(reactor)) {
          stats.reactions_sent[reactor]++;
          stats.reactions_received[sender]++;
          
          // Count reaction emojis - decode the escaped emoji
          const emoji = decodeInstagramEmoji(reaction.reaction);
          stats.top_reaction_emoji[emoji] = (stats.top_reaction_emoji[emoji] || 0) + 1;
        }
      });
    }

    // Process message content for emojis
    if (message.content && typeof message.content === 'string') {
      // First, decode any escaped emojis in the content
      const decodedContent = decodeInstagramEmoji(message.content);
      
      // Extract emojis from the decoded text
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
      const emojis = decodedContent.match(emojiRegex);
      if (emojis) {
        emojis.forEach(emoji => {
          stats.emoji_in_text[emoji] = (stats.emoji_in_text[emoji] || 0) + 1;
        });
      }
      
      // Also check for escaped emoji patterns directly in original content
      const escapedEmojiRegex = /\\u[\da-f]{4}\\u[\da-f]{4}\\u[\da-f]{4}/gi;
      const escapedEmojis = message.content.match(escapedEmojiRegex);
      if (escapedEmojis) {
        escapedEmojis.forEach(escapedEmoji => {
          const decodedEmoji = decodeInstagramEmoji(escapedEmoji);
          // Check if it's actually an emoji after decoding
          if (emojiRegex.test(decodedEmoji)) {
            stats.emoji_in_text[decodedEmoji] = (stats.emoji_in_text[decodedEmoji] || 0) + 1;
          }
        });
      }
    }

    // Process shared links (for reels and domains)
    if (message.share && message.share.link) {
      // Check if it's a reel
      if (message.share.link.includes('/reel/')) {
        stats.reels_total++;
      }

      // Extract domain (only count external domains)
      try {
        const url = new URL(message.share.link);
        const domain = url.hostname.replace('www.', '');
        
        // Only count external domains (not Instagram/Meta properties)
        if (isExternalDomain(domain)) {
          domainCounts[domain] = (domainCounts[domain] || 0) + 1;
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }

    // Calculate reply times (simplified - time between consecutive messages)
    if (index > 0) {
      const prevMessage = currentYearMessages[index - 1];
      if (prevMessage.sender_name !== sender) {
        const timeDiff = (message.timestamp_ms - prevMessage.timestamp_ms) / (1000 * 60); // minutes
        if (!replyTimes[sender]) replyTimes[sender] = [];
        if (timeDiff < 1440) { // Only count replies within 24 hours
          replyTimes[sender].push(timeDiff);
        }
      }
    }

    // Duo counting (simplified - consecutive message pairs)
    if (index > 0) {
      const prevSender = currentYearMessages[index - 1].sender_name;
      if (prevSender !== sender) {
        const duo = [prevSender, sender].sort().join('|');
        duoCounts[duo] = (duoCounts[duo] || 0) + 1;
      }
    }
  });

  if (onProgress) {
    onProgress("Calculating statistics...", 85);
  }

  // Calculate busiest day of week
  const dowCounts = {};
  Object.keys(dailyActivity).forEach(dateStr => {
    const date = new Date(dateStr);
    const dow = date.getDay();
    dowCounts[dow] = (dowCounts[dow] || 0) + dailyActivity[dateStr];
  });
  
  stats.busiest_dow = Object.entries(dowCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 1)
    .map(([dow, count]) => [parseInt(dow), count]);

  // Calculate busiest hour
  const hourCounts = {};
  stats.hourly_activity.forEach((count, hour) => {
    if (count > 0) hourCounts[hour] = count;
  });
  
  stats.busiest_hour = Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 1)
    .map(([hour, count]) => [parseInt(hour), count]);

  // Calculate longest streak
  const sortedDates = Object.keys(dailyActivity).sort();
  let longestStreak = 0;
  let currentStreak = 0;
  let lastDate = null;

  sortedDates.forEach(dateStr => {
    const currentDate = new Date(dateStr);
    if (lastDate) {
      const dayDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    longestStreak = Math.max(longestStreak, currentStreak);
    lastDate = currentDate;
  });
  
  stats.longest_streak_days = longestStreak;

  // Process top domains (used in EngagementCard)
  stats.top_domains = Object.entries(domainCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Process best duo (used in RhythmRepliesCard)
  stats.best_duo = Object.entries(duoCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 1)
    .map(([duo, count]) => [duo.split('|'), count]);

  // Calculate reply time medians (used in RhythmRepliesCard)
  Object.keys(replyTimes).forEach(sender => {
    const times = replyTimes[sender].sort((a, b) => a - b);
    if (times.length > 0) {
      const median = times.length % 2 === 0
        ? (times[times.length / 2 - 1] + times[times.length / 2]) / 2
        : times[Math.floor(times.length / 2)];
      stats.reply_times_median[sender] = Math.round(median);
    }
  });

  if (onProgress) {
    onProgress("Processing complete!", 95);
  }

  return stats;
};