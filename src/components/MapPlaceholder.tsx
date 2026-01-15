import { Map, Navigation } from "lucide-react";

export function MapPlaceholder() {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-secondary/50 border border-border">
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Pulsing circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full border border-neon-purple/30 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border border-neon-cyan/30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          </div>
          
          {/* Center icon */}
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan shadow-lg glow-combined">
            <Navigation className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Location dots */}
      <div className="absolute top-8 left-12 h-3 w-3 rounded-full bg-neon-purple/60 animate-pulse" />
      <div className="absolute top-16 right-16 h-3 w-3 rounded-full bg-neon-cyan/60 animate-pulse" style={{ animationDelay: '0.3s' }} />
      <div className="absolute bottom-12 left-1/4 h-3 w-3 rounded-full bg-neon-purple/60 animate-pulse" style={{ animationDelay: '0.6s' }} />
      <div className="absolute bottom-20 right-1/4 h-3 w-3 rounded-full bg-neon-cyan/60 animate-pulse" style={{ animationDelay: '0.9s' }} />

      {/* Label */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Map className="h-4 w-4" />
        <span>Davis, CA</span>
      </div>

      {/* View map button */}
      <button className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-neon-purple/20 px-3 py-1.5 text-sm font-medium text-neon-purple hover:bg-neon-purple/30 transition-colors">
        View Map
      </button>
    </div>
  );
}
