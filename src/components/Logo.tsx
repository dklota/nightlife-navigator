import { MapPin } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-14 w-14",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-4xl",
};

export function Logo({ size = "md", showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-xl blur-lg opacity-60 animate-pulse-neon" />
        <div className="relative bg-gradient-to-br from-neon-purple to-neon-cyan p-2 rounded-xl">
          <MapPin className={`${sizeClasses[size]} text-white`} />
        </div>
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-black tracking-tight text-gradient-neon`}>
          WTM
        </span>
      )}
    </div>
  );
}
