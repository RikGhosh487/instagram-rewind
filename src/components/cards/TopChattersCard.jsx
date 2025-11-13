import { useRef } from "react";
import { Users } from "lucide-react";
import Wrapper from "../Wrapper";

function TopChattersCard({ data, variant }) {
  const cardRef = useRef(null);
  const topChatters = data.per_sender
    ? Object.entries(data.per_sender)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))
    : [];
  const max = topChatters[0]?.count || 1;

  return (
    <Wrapper
      title="Top Chatters"
      icon={<Users className="w-6 h-6 text-white" />}
      variant={variant}
      cardRef={cardRef}
    >
      <ol className="mt-1 space-y-3">
        {topChatters.map((p, i) => (
          <li key={p.name} className="flex items-center gap-3">
            <div className="w-8 text-right font-bold text-white/80">
              {i + 1}.
            </div>
            <div className="flex-1">
              <div className="font-semibold">{p.name}</div>
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
    </Wrapper>
  );
}

export default TopChattersCard;