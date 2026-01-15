import { Star, MapPin, Users, Clock, ChevronRight } from "lucide-react";

interface BarCardProps {
  name: string;
  image: string;
  rating: number;
  distance: string;
  crowdLevel: "Low" | "Medium" | "High" | "Packed";
  hours: string;
  tags: string[];
}

const crowdColors = {
  Low: "text-neon-cyan",
  Medium: "text-yellow-400",
  High: "text-orange-400",
  Packed: "text-red-400",
};

const crowdBg = {
  Low: "bg-neon-cyan/10",
  Medium: "bg-yellow-400/10",
  High: "bg-orange-400/10",
  Packed: "bg-red-400/10",
};

export function BarCard({ 
  name, 
  image, 
  rating, 
  distance, 
  crowdLevel, 
  hours, 
  tags 
}: BarCardProps) {
  return (
    <div className="bar-card group cursor-pointer">
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
          <img 
            src={image} 
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between py-1">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-foreground text-lg leading-tight">{name}</h3>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-neon-purple" />
            </div>
            
            {/* Tags */}
            <div className="mt-1 flex flex-wrap gap-1.5">
              {tags.slice(0, 2).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-foreground">{rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{distance}</span>
            </div>
            <div className={`flex items-center gap-1 ${crowdColors[crowdLevel]}`}>
              <Users className="h-3.5 w-3.5" />
              <span className={`text-xs px-1.5 py-0.5 rounded ${crowdBg[crowdLevel]} font-medium`}>
                {crowdLevel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
