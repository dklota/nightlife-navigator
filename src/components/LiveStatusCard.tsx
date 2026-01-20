import { Clock, Users, Sparkles } from "lucide-react";

interface LiveStatusCardProps {
  waitTime: string;
  crowdLevel: string;
  vibe: string;
  lastUpdated: string;
}

const crowdColors: Record<string, string> = {
  Quiet: "text-neon-cyan",
  Vibe: "text-yellow-400",
  Packed: "text-red-400",
};

const crowdBg: Record<string, string> = {
  Quiet: "bg-neon-cyan/10",
  Vibe: "bg-yellow-400/10",
  Packed: "bg-red-400/10",
};

export function LiveStatusCard({ waitTime, crowdLevel, vibe, lastUpdated }: LiveStatusCardProps) {
  return (
    <div className="bar-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live Status
        </h2>
        <span className="text-xs text-muted-foreground">Updated {lastUpdated}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Wait Time */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 mx-auto rounded-xl bg-neon-purple/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-neon-purple" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Wait Time</p>
            <p className="font-bold text-foreground">{waitTime}</p>
          </div>
        </div>

        {/* Crowd Level */}
        <div className="text-center space-y-2">
          <div className={`h-14 w-14 mx-auto rounded-xl ${crowdBg[crowdLevel] || "bg-secondary"} flex items-center justify-center`}>
            <Users className={`h-6 w-6 ${crowdColors[crowdLevel] || "text-muted-foreground"}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Crowd</p>
            <p className={`font-bold ${crowdColors[crowdLevel] || "text-foreground"}`}>{crowdLevel}</p>
          </div>
        </div>

        {/* Vibe */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 mx-auto rounded-xl bg-neon-cyan/10 flex items-center justify-center">
            <span className="text-2xl">{vibe}</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Vibe</p>
            <p className="font-bold text-foreground">
              {vibe === "🔥" ? "Fire" : vibe === "😴" ? "Chill" : "Dancing"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
