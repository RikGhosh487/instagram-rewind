import { useRef } from "react";
import { MessageCircle, Timer, Users } from "lucide-react";
import Wrapper from "../Wrapper";
import Row from "../Row";

function ReplyCard({ data, variant }) {
  const cardRef = useRef(null);
  
  const formatTime = (minutes) => {
    if (minutes >= 1440) { // 24 hours or more
      const days = minutes / 1440;
      return `${days.toFixed(1)} day${days >= 2 ? 's' : ''}`;
    }
    if (minutes >= 60) {
      const hours = minutes / 60;
      return `${hours.toFixed(1)} hr`;
    }
    return `${Math.round(minutes)} min`;
  };
  
  const getSortedResponders = (ascending = true) => {
    if (!data.reply_times_median) return [];
    
    return Object.entries(data.reply_times_median)
      .sort(([, a], [, b]) => ascending ? a - b : b - a)
      .slice(0, 3)
      .map(([name, medianMinutes]) => ({ 
        name, 
        medianMinutes,
        formattedTime: formatTime(medianMinutes)
      }));
  };

  const fastestResponders = getSortedResponders(true);
  const slowestResponders = getSortedResponders(false);

  return (
    <Wrapper
      title="Replies"
      icon={<MessageCircle className="w-6 h-6 text-white" />}
      variant={variant}
      cardRef={cardRef}
    >
      <div className="grid grid-cols-1 gap-4">
        {/* Response Times Ranking */}
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h5 className="text-slate-300 text-xs mb-2">
                fastest responders (median)
              </h5>
              {fastestResponders.map((r) => (
                <Row
                  key={r.name}
                  label={r.name.split(" ")[0]}
                  value={r.formattedTime}
                />
              ))}
            </div>
            <div>
              <h5 className="text-slate-300 text-xs mb-2">
                slowest responders (median)
              </h5>
              {slowestResponders.map((r) => (
                <Row
                  key={r.name}
                  label={r.name.split(" ")[0]}
                  value={r.formattedTime}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Awards */}
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          {/* Best Duo */}
          {data.best_duo && data.best_duo.length > 0 && (
            <>
              <h5 className="text-slate-300 text-xs mb-2">
                best duo (most back and forth messages)
              </h5>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-300" />
                    <span className="text-white font-semibold">
                      {data.best_duo[0][0]
                        .map(name => name.split(" ")[0])
                        .join(" & ")
                      }
                    </span>
                  </div>
                  <div className="text-white font-bold tabular-nums">
                    {data.best_duo[0][1]} messages
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Ghost Mode */}
          {data.ghost_mode && (
            <>
              <h5 className="text-slate-300 text-xs mb-2 mt-4">
                longest hiatus (biggest gap between messages)
              </h5>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-slate-300" />
                    <span className="text-white font-semibold">
                      {data.ghost_mode[0]}
                    </span>
                  </div>
                  <div className="text-white font-bold tabular-nums">
                    {formatTime(data.ghost_mode[1])}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  )
}

export default ReplyCard;