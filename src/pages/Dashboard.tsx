import { Logo } from "@/components/Logo";
import { BarCard } from "@/components/BarCard";
import { BottomNav } from "@/components/BottomNav";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { Bell, Search, Filter, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for UI demonstration
const mockBars = [
  {
    id: "woodstocks-pizza",
    name: "Woodstock's Pizza",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop",
    rating: 4.5,
    distance: "0.3 mi",
    crowdLevel: "High" as const,
    hours: "11am - 2am",
    tags: ["Pizza", "Beer Garden"],
  },
  {
    id: "the-graduate",
    name: "The Graduate",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=400&fit=crop",
    rating: 4.2,
    distance: "0.5 mi",
    crowdLevel: "Medium" as const,
    hours: "4pm - 2am",
    tags: ["Sports Bar", "Late Night"],
  },
  {
    id: "deveres-irish-pub",
    name: "de Vere's Irish Pub",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=400&fit=crop",
    rating: 4.7,
    distance: "0.4 mi",
    crowdLevel: "Packed" as const,
    hours: "11am - 1am",
    tags: ["Irish Pub", "Live Music"],
  },
  {
    id: "sophias-thai-kitchen",
    name: "Sophia's Thai Kitchen",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop",
    rating: 4.4,
    distance: "0.6 mi",
    crowdLevel: "Low" as const,
    hours: "11am - 9pm",
    tags: ["Thai", "Cocktails"],
  },
  {
    id: "burgers-and-brew",
    name: "Burgers & Brew",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=400&fit=crop",
    rating: 4.3,
    distance: "0.2 mi",
    crowdLevel: "Medium" as const,
    hours: "11am - 12am",
    tags: ["Burgers", "Craft Beer"],
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
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-neon-purple" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 space-y-6">
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search bars..." 
              className="pl-10 h-11 bg-secondary/50"
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Map Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Nearby</h2>
            <span className="text-sm text-muted-foreground">Davis, CA</span>
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
                    ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-white"
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
            <BarCard key={bar.name} {...bar} />
          ))}
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
