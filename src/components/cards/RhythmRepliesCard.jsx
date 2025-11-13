import { useRef } from "react";
import { Clock3, Users } from "lucide-react";
import Wrapper from "../Wrapper";
import Row from "../Row";

function RhythmRepliesCard({ data, variant }) {
  const cardRef = useRef(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const fastestResponders = data.reply_times_median
    ? Object.entries(data.reply_times_median)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 3)
        .map(([name, medianMinutes]) => ({ name, medianMinutes }))
    : [];

  const busiestDay = data.busiest_dow?.[0]
    ? [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ][data.busiest_dow[0][0]]
    : "—";
  const busiestHour = data.busiest_hour?.[0]
    ? `${data.busiest_hour[0][0].toString().padStart(2, "0")}:00`
    : "—";

  return (
    <Wrapper
      title="Rhythm & Replies"
      icon={<Clock3 className="w-6 h-6 text-white" />}
      variant={variant}
      cardRef={cardRef}
    >
      <div className="grid grid-cols-1 gap-4">
        {/* Tempo */}
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-2xl font-bold">{busiestDay}</div>
              <div className="text-slate-300 text-xs">busiest day</div>
            </div>
            <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-2xl font-bold">{busiestHour}</div>
              <div className="text-slate-300 text-xs">busiest hour</div>
            </div>
          </div>

          {/* Sparkline strip -- real activity data */}
          <div>
            <div className="text-slate-300 text-xs mb-1">
              activity (24h)
            </div>
            <div className="flex gap-0.5 justify-between">
              {hours.map((h) => {
                const activityLevel = data.hourly_activity
                  ? data.hourly_activity[h]
                  : 0;
                const height = Math.max(10, activityLevel); // minimum height
                return (
                  <div
                    key={h}
                    className={
                      "w-3 h-10 rounded bg-white/10 overflow-hidden"
                    }
                    title={`${h}:00 - ${activityLevel}% activity`}
                  >
                    <div
                      className="w-full rounded bg-white/70"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fastest Responders */}
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <h5 className="text-slate-300 text-xs mb-2">
            fastest responders (median)
          </h5>
          <div className="mb-4">
            {fastestResponders.map((p) => (
              <Row
                key={p.name}
                label={p.name}
                value={`${p.medianMinutes} min`}
              />
            ))}
          </div>

          {/* Best Duo */}
          {data.best_duo && data.best_duo.length > 0 && (
            <>
              <h5 className="text-slate-300 text-xs mb-2">
                best duo (most back and forth messages)
              </h5>
              <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-300" />
                    <span className="text-white font-semibold">
                      {data.best_duo[0][0].join(" & ")}
                    </span>
                  </div>
                  <div className="text-white font-bold tabular-nums">
                    {data.best_duo[0][1]} messages
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

export default RhythmRepliesCard;