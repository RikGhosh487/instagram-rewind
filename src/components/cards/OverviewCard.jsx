import { useRef } from "react";
import {
  Crown,
  Heart,
  MessageSquare,
  Image,
  Video,
  Mic,
  Share2,
  Calendar,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "../ui/badge";
import Wrapper from "../Wrapper";

function OverviewCard({ data }) {
  const cardRef = useRef(null);
  const topChatters = data.per_sender
    ? Object.entries(data.per_sender)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))
    : [];

  return (
    <Wrapper
      title={`${
        data.rewind_year || new Date().getFullYear()
      } in ${
        data.chat_title || "Chat"
      }`}
      icon={<Crown className="w-6 h-6 text-white" />}
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
        
        {/* Milestones - Compact Timeline */}
        {data.milestones && (
          <div className="mt-4 relative">
            {/* Vertical Line */}
            <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-white/20" />
            
            <div className="space-y-2 relative">
              {data.milestones.first_message && (
                <div className="flex items-center gap-2 relative">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 z-10">
                    <Calendar className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex items-center justify-between flex-1 text-xs">
                    <span className="text-white/60">First Message</span>
                    <span className="font-semibold text-white">
                      {new Date(data.milestones.first_message).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </span>
                  </div>
                </div>
              )}
              {data.milestones.milestone_100 && (
                <div className="flex items-center gap-2 relative">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 z-10">
                    <Target className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex items-center justify-between flex-1 text-xs">
                    <span className="text-white/60">100th Message</span>
                    <span className="font-semibold text-white">
                      {new Date(data.milestones.milestone_100).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </span>
                  </div>
                </div>
              )}
              {data.milestones.busiest_week?.start && (
                <div className="flex items-center gap-2 relative">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 z-10">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex items-center justify-between flex-1 text-xs">
                    <span className="text-white/60">Busiest Week</span>
                    <span className="font-semibold text-white">
                      {data.milestones.busiest_week.count} msgs
                    </span>
                  </div>
                </div>
              )}
              {data.milestones.active_days > 0 && (
                <div className="flex items-center gap-2 relative">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 z-10">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex items-center justify-between flex-1 text-xs">
                    <span className="text-white/60">Active Days</span>
                    <span className="font-semibold text-white">
                      {data.milestones.active_days}/{new Date(data.rewind_year, 11, 31).getDate() === 31 ? 365 : 366}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Message Type Breakdown */}
        {data.message_types && (
          <div className="mt-4">
            <div className="text-xs font-medium text-white/60 mb-3">
              Message Types
            </div>
            <div className="grid grid-cols-4 gap-2">
              {data.message_types.text > 0 && (
                <div
                  className={
                    "flex flex-col items-center gap-1 px-2 py-2 rounded-lg " +
                    "bg-white/10 backdrop-blur-sm"
                  }
                >
                  <MessageSquare className="w-4 h-4 text-white/70" />
                  <div className="text-xs text-white/60">Text</div>
                  <div className="text-sm font-semibold">
                    {data.message_types.text}
                  </div>
                </div>
              )}
              {data.message_types.photos > 0 && (
                <div
                  className={
                    "flex flex-col items-center gap-1 px-2 py-2 rounded-lg " +
                    "bg-white/10 backdrop-blur-sm"
                  }
                >
                  <Image className="w-4 h-4 text-white/70" />
                  <div className="text-xs text-white/60">Photos</div>
                  <div className="text-sm font-semibold">
                    {data.message_types.photos}
                  </div>
                </div>
              )}
              {data.message_types.videos > 0 && (
                <div
                  className={
                    "flex flex-col items-center gap-1 px-2 py-2 rounded-lg " +
                    "bg-white/10 backdrop-blur-sm"
                  }
                >
                  <Video className="w-4 h-4 text-white/70" />
                  <div className="text-xs text-white/60">Videos</div>
                  <div className="text-sm font-semibold">
                    {data.message_types.videos}
                  </div>
                </div>
              )}
              {data.message_types.shares > 0 && (
                <div
                  className={
                    "flex flex-col items-center gap-1 px-2 py-2 rounded-lg " +
                    "bg-white/10 backdrop-blur-sm"
                  }
                >
                  <Share2 className="w-4 h-4 text-white/70" />
                  <div className="text-xs text-white/60">Shares</div>
                  <div className="text-sm font-semibold">
                    {data.message_types.shares}
                  </div>
                </div>
              )}
              {data.message_types.audio > 0 && (
                <div
                  className={
                    "flex flex-col items-center gap-1 px-2 py-2 rounded-lg " +
                    "bg-white/10 backdrop-blur-sm"
                  }
                >
                  <Mic className="w-4 h-4 text-white/70" />
                  <div className="text-xs text-white/60">Audio</div>
                  <div className="text-sm font-semibold">
                    {data.message_types.audio}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default OverviewCard;
