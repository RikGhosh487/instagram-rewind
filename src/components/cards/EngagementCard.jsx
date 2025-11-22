import { useRef } from "react";
import { Heart, PlayCircle } from "lucide-react";
import Wrapper from "../Wrapper";
import Row from "../Row";

function EngagementCard({ data, isStoriesMode = false }) {
  const cardRef = useRef(null);
  const emojiLimit = isStoriesMode ? 3 : 5;
  const topEmojis = data.top_reaction_emoji
    ? Object.entries(data.top_reaction_emoji)
        .sort(([, a], [, b]) => b - a)
        .slice(0, emojiLimit)
        .map(([emoji, count]) => ({ emoji, count }))
    : [];

  const sentTop = data.reactions_sent
    ? Object.entries(data.reactions_sent)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, count]) => ({ name, count }))
    : [];

  const receivedTop = data.reactions_received
    ? Object.entries(data.reactions_received)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, count]) => ({ name, count }))
    : [];

  const textEmojis = data.emoji_in_text
    ? Object.entries(data.emoji_in_text)
        .sort(([, a], [, b]) => b - a)
        .slice(0, emojiLimit)
        .map(([emoji, count]) => ({ emoji, count }))
    : [];

  return (
    <Wrapper
      title="Engagement"
      icon={<Heart className="w-6 h-6 text-white" />}
      cardRef={cardRef}
      isStoriesMode={isStoriesMode}
    >
      <div className="grid grid-cols-1 gap-4">
        {/* Reactions */}
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <h4 className="text-slate-300 text-sm mb-2">
            Top reaction emoji
          </h4>
          <div className="flex flex-wrap gap-3">
            {topEmojis.map((e) => (
              <span key={e.emoji} className="text-2xl leading-none">
                {e.emoji}
                <span className="align-super text-xs text-slate-300 ml-2">
                  x{e.count}
                </span>
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h5 className="text-slate-300 text-xs mb-2">
                Reactions sent
              </h5>
              {sentTop.map((p) => (
                <Row key={p.name} label={p.name} value={p.count} />
              ))}
            </div>
            <div>
              <h5 className="text-slate-300 text-xs mb-2">
                Reactions received
              </h5>
              {receivedTop.map((p) => (
                <Row key={p.name} label={p.name} value={p.count} />
              ))}
            </div>
          </div>
        </div>
        {/* Right: Content & Engagement Stats */}
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-2xl font-bold">
                {data.reels_total || 0}
              </div>
              <div className="text-slate-300 text-xs flex items-center gap-1">
                reels shared <PlayCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-2xl font-bold">
                {data.reactions_sent
                  ? Object.values(data.reactions_sent).reduce(
                      (a, b) => a + b,
                      0
                    )
                  : 0}
              </div>
              <div className="text-slate-300 text-xs flex items-center gap-1">
                total reactions <Heart className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Engagement Rate */}
          <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10 mb-4">
            <div className="text-lg font-bold">
              {data.total_messages && data.reactions_sent
                ? `${Math.round(
                    (Object.values(data.reactions_sent).reduce(
                      (a, b) => a + b,
                      0
                    ) /
                      data.total_messages) *
                      100
                  )}%`
                : "0%"}
            </div>
            <div className="text-slate-300 text-xs">
              engagement rate (reactions per message)
            </div>
          </div>

          {textEmojis.length > 0 ? (
            <>
              <h5 className="text-slate-300 text-xs mb-2">
                Emojis in messages
              </h5>
              <div className="flex flex-wrap gap-3">
                {textEmojis.map((e) => (
                  <span key={e.emoji} className="text-2xl leading-none">
                    {e.emoji}
                    <span className="align-super text-xs text-slate-300 ml-1">
                      x{e.count}
                    </span>
                  </span>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
}

export default EngagementCard;
