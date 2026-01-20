import { Star, MapPin, Users, ChevronRight, Clock, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BarCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  crowdLevel: "Low" | "Medium" | "High" | "Packed";
  waitTime: number;
  vibe: string;
  hours: string;
  tags: string[];
  hometownCount?: number;
  hometown?: string;
}

const crowdColors = {
  Low: "text-neon-cyan",
  Medium: "text-yellow-400",
  High: "text-orange-400",
  Packed: "text-red-400",
};

const crowdBg = {
  Low: "bg-neon-cyan/10 border-neon-cyan/30",
  Medium: "bg-yellow-400/10 border-yellow-400/30",
  High: "bg-orange-400/10 border-orange-400/30",
  Packed: "bg-red-400/10 border-red-400/30",
};

const getWaitTimeColor = (waitTime: number) => {
  if (waitTime <= 10) return "text-neon-cyan";
  if (waitTime <= 25) return "text-yellow-400";
  return "text-orange-400";
};

const getWaitTimeGlow = (waitTime: number) => {
  if (waitTime <= 10) return "shadow-neon-cyan/50";
  if (waitTime <= 25) return "shadow-yellow-400/50";
  return "shadow-orange-400/50";
};

export function BarCard({ 
  id,
  name, 
  image, 
  rating, 
  distance, 
  crowdLevel,
  waitTime,
  vibe,
  hours, 
  tags,
  hometownCount,
  hometown,
}: BarCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      className="bar-card group cursor-pointer"
      onClick={() => navigate(`/bar/${id}`)}
    >
      <div className="flex gap-4">
        {/* Image with Vibe Overlay */}
        <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl">
          <img 
            src={image} 
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          {/* Vibe Badge */}
          <div className="absolute bottom-2 left-2 text-2xl">
            {vibe}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between py-1">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-foreground text-lg leading-tight pr-2">{name}</h3>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-neon-purple flex-shrink-0" />
            </div>
            
            {/* Wait Time - Prominent Display */}
            <div className="mt-2 flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg bg-background/50 border border-border/50 ${getWaitTimeGlow(waitTime)} shadow-sm`}>
                <Clock className={`h-4 w-4 ${getWaitTimeColor(waitTime)}`} />
                <span className={`font-black text-lg ${getWaitTimeColor(waitTime)}`}>
                  {waitTime}m
                </span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${crowdBg[crowdLevel]}`}>
                <Users className={`h-3.5 w-3.5 ${crowdColors[crowdLevel]}`} />
                <span className={`text-xs font-bold ${crowdColors[crowdLevel]}`}>
                  {crowdLevel}
                </span>
              </div>
            </div>

            {/* Hometown Badge */}
            {hometownCount && hometownCount > 0 && hometown && (
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <Home className="h-3 w-3 text-neon-purple" />
                <span className="text-neon-purple font-medium">
                  {hometownCount} from {hometown}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Row */}
          <div className="flex items-center gap-3 text-sm mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-foreground">{rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{distance}</span>
            </div>
            {/* Tags */}
            <div className="flex gap-1 overflow-hidden">
              {tags.slice(0, 1).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-secondary/80 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
