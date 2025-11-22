import { useRef } from "react";
import { Users, Heart } from "lucide-react";
import Wrapper from "../Wrapper";

function TopChattersCard({ data, isStoriesMode = false }) {
  const cardRef = useRef(null);
  const topChatters = data.per_sender
    ? Object.entries(data.per_sender)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => {
          // Get top emoji for this person
          const personEmojis = data.per_sender_emoji_usage?.[name] || {};
          const topEmoji = Object.entries(personEmojis)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || "";
          return { name, count, emoji: topEmoji };
        })
    : [];
  const max = topChatters[0]?.count || 1;

  return (
    <Wrapper
      title="Top Chatters"
      icon={<Users className="w-6 h-6 text-white" />}
      cardRef={cardRef}
      isStoriesMode={isStoriesMode}
    >
      <ol className="mt-1 space-y-3">
        {topChatters.map((p, i) => (
          <li key={p.name} className="flex items-center gap-3">
            <div className="w-8 text-right font-bold text-white/80">
              {i + 1}.
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{p.name}</div>
                {p.emoji && (
                  <div className="text-lg leading-none">{p.emoji}</div>
                )}
              </div>
              <div className="h-1.5 bg-white/10 rounded-full mt-1">
                <div
                  className="h-1.5 rounded-full bg-white/70"
                  style={{ width: `${(p.count / max) * 100}%` }}
                />
              </div>
            </div>
            <div className="font-bold tabular-nums">{p.count}</div>
          </li>
        ))}
      </ol>
      
      {/* Most Reacted Message */}
      {data.most_reacted_message && (
        <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
          <div className="text-xs font-medium text-white/60 tracking-wide">
            Most reacted message
          </div>
          <div className="flex items-start gap-2.5">
            <div
              className={
                "flex-shrink-0 w-7 h-7 rounded-full bg-white/25 " +
                "flex items-center justify-center text-xs font-bold text-white"
              }
            >
              {data.most_reacted_message.sender.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white mb-1">
                {data.most_reacted_message.sender}
              </div>
              <div className="relative">
                <div
                  className={
                    "relative rounded-3xl rounded-tl-none bg-white/20 " +
                    "backdrop-blur-sm px-4 py-2.5"
                  }
                >
                  <div className="text-sm text-white/95 leading-relaxed">
                    {data.most_reacted_message.content.length > 120
                      ? data.most_reacted_message.content.substring(0, 120) +
                        "..."
                      : data.most_reacted_message.content}
                  </div>
                </div>
                <div
                  className={
                    "absolute -bottom-2 -right-1 flex items-center gap-1 " +
                    "px-2 py-1 rounded-full bg-pink-500/20 backdrop-blur-sm " +
                    "ring-2 ring-pink-500/30"
                  }
                >
                  <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
                  <span className="text-xs font-semibold text-white">
                    {data.most_reacted_message.reaction_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
}

export default TopChattersCard;
