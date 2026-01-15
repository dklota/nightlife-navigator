import { MapPin, List, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: <MapPin className="h-5 w-5" />, label: "Explore", active: true },
  { icon: <List className="h-5 w-5" />, label: "List" },
  { icon: <Users className="h-5 w-5" />, label: "Friends" },
  { icon: <User className="h-5 w-5" />, label: "Profile" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
              item.active
                ? "text-neon-purple"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "relative",
              item.active && "after:absolute after:inset-0 after:bg-neon-purple/20 after:blur-lg after:-z-10"
            )}>
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
