import { useRef } from "react";
import { Clock3, Zap } from "lucide-react";
import Wrapper from "../Wrapper";
import Row from "../Row";

function RhythmCard({ data }) {
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
      title="Rhythm"
      icon={<Clock3 className="w-6 h-6 text-white" />}
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
              {(() => {
                // Calculate the maximum activity to normalize the data
                const maxActivity = data.hourly_activity
                  ? Math.max(...data.hourly_activity)
                  : 1; // Prevent division by zero
                
                return hours.map((h) => {
                  const rawActivityCount = data.hourly_activity
                    ? data.hourly_activity[h]
                    : 0;
                  
                  // Normalize to percentage (0-100) based on max activity
                  const activityPercentage = maxActivity > 0 
                    ? Math.round((rawActivityCount / maxActivity) * 100)
                    : 0;
                  
                  // minimum height 10%
                  const height = Math.max(10, activityPercentage);
                  
                  return (
                    <div
                      key={h}
                      className={
                        "w-3 h-10 rounded bg-white/10 overflow-hidden"
                      }
                      title={
                        `${h}:00 - ${rawActivityCount} messages ` +
                        `(${activityPercentage}% of peak)`
                      }
                    >
                      <div
                        className="w-full rounded bg-white/70"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
        
        {/* Burstiness Gauge */}
        {data.burstiness_coefficient !== undefined && (
          <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-slate-300 text-xs mb-3">messaging pattern</div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-white/60 font-medium">Steady</div>
              <div className="flex-1 relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-red-400/50 rounded-full"
                  style={{ width: '100%' }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-full shadow-lg"
                  style={{ 
                    left: `${Math.min(100, (data.burstiness_coefficient / 2) * 100)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
              <div className="text-xs text-white/60 font-medium">Bursty</div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs">
              <Zap className="w-3 h-3 text-white/70" />
              <span className="text-white/80">
                {data.burstiness_coefficient < 0.5 ? 'Very Steady' :
                 data.burstiness_coefficient < 1.0 ? 'Steady' :
                 data.burstiness_coefficient < 1.5 ? 'Moderate' :
                 data.burstiness_coefficient < 2.0 ? 'Bursty' : 'Very Bursty'}
              </span>
              <span className="text-white/50">•</span>
              <span className="text-white/50">{data.burstiness_coefficient.toFixed(2)}</span>
            </div>
          </div>
        )}
        
        {/* Weekend vs Weekday Split */}
        {(data.weekend_messages !== undefined && data.weekday_messages !== undefined) && (
          <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-slate-300 text-xs mb-3">weekend vs weekday</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-sm text-white/80">Weekday</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {data.weekday_messages.toLocaleString()}
                  </span>
                  <span className="text-xs text-white/50">
                    ({((data.weekday_messages / (data.weekday_messages + data.weekend_messages)) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-sm text-white/80">Weekend</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {data.weekend_messages.toLocaleString()}
                  </span>
                  <span className="text-xs text-white/50">
                    ({((data.weekend_messages / (data.weekday_messages + data.weekend_messages)) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default RhythmCard;
