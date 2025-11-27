// Instagram-specific data processing utilities

// Helper function to decode Instagram"s escaped UTF-8 emoji encoding
export const decodeInstagramEmoji = (escapedEmoji) => {
  try {
    // Instagram stores emojis as UTF-8 byte sequences
    // For example: "\u00e2\u009d\u00a4" represents the heart emoji ❤️
    
    // Convert the escaped unicode sequences to bytes
    let result = escapedEmoji;
    
    // Handle the common Instagram emoji encoding format
    // Replace \uXXXX patterns with their byte equivalents
    result = result.replace(/\\u[\da-f]{4}/gi, (match) => {
      const hex = match.substring(2); // Remove \u prefix
      const code = parseInt(hex, 16);
      return String.fromCharCode(code);
    });
    
    // Try to decode as UTF-8
    try {
      // If it"s valid UTF-8, this should give us the proper emoji
      const bytes = new Uint8Array(result.length);
      for (let i = 0; i < result.length; i++) {
        bytes[i] = result.charCodeAt(i);
      }
      result = new TextDecoder("utf-8").decode(bytes);
    } catch (e) {
      // If UTF-8 decoding fails, just use the original
    }
    
    return result;
  } catch (e) {
    // If all else fails, return the original string
    return escapedEmoji;
  }
};

// Helper function to check if a domain should be excluded from top_domains
export const isExternalDomain = (domain) => {
  const internalDomains = [
    "instagram.com", 
    "ig.me",
    "facebook.com",
    "fb.com",
    "meta.com"
  ];
  return !internalDomains.some(internal => domain.includes(internal));
};

// Filter messages to current year only
// Determine which year should be used for the rewind.
// By default, use the current year, but keep showing the previous
// calendar year through the end of March (i.e. Jan-Mar still show last year).
export const getRewindYear = (referenceDate = new Date()) => {
  const month = referenceDate.getMonth(); // 0 = Jan, 11 = Dec
  const year = referenceDate.getFullYear();
  // If we're in Jan/Feb/Mar (months 0,1,2), use the previous year
  return month <= 2 ? year - 1 : year;
};

// Filter messages to a specific year. If `targetYear` is not provided,
// it will be derived from `getRewindYear()` so the app shows the previous
// year through March and switches after that.
export const filterMessagesByYear = (messages, targetYear = null) => {
  const year = targetYear !== null ? targetYear : getRewindYear();
  const yearStart = new Date(year, 0, 1).getTime();
  const yearEnd = new Date(year + 1, 0, 1).getTime();

  return messages.filter(message => 
    message.timestamp_ms >= yearStart && message.timestamp_ms < yearEnd
  );
};
