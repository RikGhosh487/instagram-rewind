import { useRef } from "react";
import { Crown } from "lucide-react";
import { Badge } from "../ui/badge";
import Wrapper from "../Wrapper";

function OverviewCard({ data, variant }) {
  const cardRef = useRef(null);
  const topChatters = data.per_sender
    ? Object.entries(data.per_sender)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))
    : [];

  return (
    <Wrapper
      title="Your Year in Chat"
      icon={<Crown className="w-6 h-6 text-white" />}
      variant={variant}
      cardRef={cardRef}
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {data.total_messages?.toLocaleString()}
        </div>
        <div className="text-white/80 -mt-1">total messages</div>
        <div className="grid grid-cols-2 gap-3">
          <div
            className={
              "rounded-xl bg-white/10 p-4 ring-1 ring-white/20 " +
              "backdrop-blur-sm"
            }
          >
            <div className="text-2xl font-bold">
              {data.longest_streak_days || 0}
            </div>
            <div className="text-white/80 text-sm">
              longest streak (days)
            </div>
          </div>
          <div
            className={
              "rounded-xl bg-white/10 p-4 ring-1 ring-white/20 " +
              "backdrop-blur-sm"
            }
          >
            <div className="text-2xl font-bold">
              {data.busiest_dow?.[0]
                ? [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun",
                  ][data.busiest_dow[0][0]]
                : "—"}
            </div>
            <div className="text-white/80 text-sm">busiest day</div>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {topChatters.slice(0, 5).map((p, i) => (
            <Badge
              key={p.name}
              className={
                "bg-white/15 hover:bg-white/25 text-white rounded-xl " +
                "px-3 py-1 text-xs backdrop-blur-sm"
              }
            >
              #{i + 1} {p.name} • {p.count}
            </Badge>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}

export default OverviewCard;