import { Logo } from "@/components/Logo";
import { BarCard } from "@/components/BarCard";
import { BottomNav } from "@/components/BottomNav";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { Bell, Search, Filter, TrendingUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Simulated user hometown
const USER_HOMETOWN = "San Francisco";

// Real Davis bars with Friday night mock data
const mockBars = [
  {
    id: "g-street-wonders",
    name: "G Street WunderBar",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=400&fit=crop",
    rating: 4.6,
    distance: "0.2 mi",
    crowdLevel: "Packed" as const,
    waitTime: 35,
    vibe: "🔥",
    hours: "5pm - 2am",
    tags: ["Cocktails", "DJ"],
    hometownCount: 8,
  },
  {
    id: "froggys",
    name: "Froggy's Bar & Grill",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=400&fit=crop",
    rating: 4.3,
    distance: "0.3 mi",
    crowdLevel: "High" as const,
    waitTime: 20,
    vibe: "💃",
    hours: "11am - 2am",
    tags: ["Sports Bar", "Late Night"],
    hometownCount: 5,
  },
  {
    id: "sophias-bar",
    name: "Sophia's Thai Bar",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop",
    rating: 4.7,
    distance: "0.4 mi",
    crowdLevel: "Medium" as const,
    waitTime: 10,
    vibe: "🍻",
    hours: "4pm - 12am",
    tags: ["Cocktails", "Chill"],
    hometownCount: 3,
  },
  {
    id: "university-beer-garden",
    name: "University Beer Garden",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=400&fit=crop",
    rating: 4.5,
    distance: "0.5 mi",
    crowdLevel: "Packed" as const,
    waitTime: 45,
    vibe: "🔥",
    hours: "12pm - 2am",
    tags: ["Beer Garden", "Live Music"],
    hometownCount: 12,
  },
  {
    id: "deveres-irish-pub",
    name: "de Vere's Irish Pub",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop",
    rating: 4.8,
    distance: "0.3 mi",
    crowdLevel: "High" as const,
    waitTime: 25,
    vibe: "💃",
    hours: "11am - 1am",
    tags: ["Irish Pub", "Whiskey"],
    hometownCount: 6,
  },
  {
    id: "the-graduate",
    name: "The Graduate",
    image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=400&h=400&fit=crop",
    rating: 4.4,
    distance: "0.6 mi",
    crowdLevel: "Medium" as const,
    waitTime: 5,
    vibe: "🧊",
    hours: "4pm - 2am",
    tags: ["Pool", "Dive Bar"],
    hometownCount: 2,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-neon-purple animate-pulse" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 space-y-6">
        {/* Live Status Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neon-purple/20 via-neon-cyan/10 to-neon-purple/20 p-4 border border-neon-purple/30">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 to-neon-cyan/5 animate-pulse" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center animate-glow-pulse">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Friday Night in Davis</p>
                <p className="text-xs text-muted-foreground">247 students out right now</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">11:42 PM</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search bars..." 
              className="pl-10 h-11 bg-secondary/50 border-border/50 focus:border-neon-purple/50 transition-colors"
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 border-border/50 hover:border-neon-purple/50 hover:bg-neon-purple/10">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Map Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Nearby</h2>
            <span className="text-sm text-neon-cyan font-medium">Davis, CA</span>
          </div>
          <MapPlaceholder />
        </section>

        {/* Trending Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-neon-purple" />
            <h2 className="text-lg font-bold text-foreground">Hot Right Now</h2>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {["All", "Bars", "Clubs", "Late Night", "Happy Hour"].map((filter, index) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  index === 0
                    ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-lg shadow-neon-purple/30"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Bar List */}
        <section className="space-y-3">
          {mockBars.map((bar) => (
            <BarCard 
              key={bar.id} 
              {...bar} 
              hometown={USER_HOMETOWN}
            />
          ))}
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
