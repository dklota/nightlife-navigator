import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users, Share2, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { ReportDrawer } from "@/components/ReportDrawer";
import { LiveStatusCard } from "@/components/LiveStatusCard";
import { LiveWall } from "@/components/LiveWall";
import { useState } from "react";

// Mock bar data with coordinates for GPS verification
const mockBarsData: Record<string, {
  id: string;
  name: string;
  image: string;
  address: string;
  hours: string;
  tags: string[];
  coordinates: { lat: number; lng: number };
  liveStatus: {
    waitTime: string;
    crowdLevel: string;
    vibe: string;
    lastUpdated: string;
  };
  comments: { id: string; text: string; time: string; vibe: string }[];
}> = {
  "woodstocks-pizza": {
    id: "woodstocks-pizza",
    name: "Woodstock's Pizza",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop",
    address: "219 G St, Davis, CA 95616",
    hours: "11am - 2am",
    tags: ["Pizza", "Beer Garden", "Late Night"],
    coordinates: { lat: 38.5449, lng: -121.7405 },
    liveStatus: {
      waitTime: "10-30m",
      crowdLevel: "Packed",
      vibe: "🔥",
      lastUpdated: "5 min ago",
    },
    comments: [
      { id: "1", text: "Line is moving fast tonight! 🍕", time: "2m ago", vibe: "🔥" },
      { id: "2", text: "Great energy, DJ is fire", time: "8m ago", vibe: "💃" },
      { id: "3", text: "Grab a spot on the patio if you can", time: "15m ago", vibe: "🔥" },
    ],
  },
  "the-graduate": {
    id: "the-graduate",
    name: "The Graduate",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=400&fit=crop",
    address: "805 Russell Blvd, Davis, CA 95616",
    hours: "4pm - 2am",
    tags: ["Sports Bar", "Late Night", "Pool"],
    coordinates: { lat: 38.5435, lng: -121.7520 },
    liveStatus: {
      waitTime: "0-10m",
      crowdLevel: "Vibe",
      vibe: "💃",
      lastUpdated: "12 min ago",
    },
    comments: [
      { id: "1", text: "Pool tables are open!", time: "5m ago", vibe: "💃" },
      { id: "2", text: "Game night energy ⚽", time: "20m ago", vibe: "🔥" },
    ],
  },
  "deveres-irish-pub": {
    id: "deveres-irish-pub",
    name: "de Vere's Irish Pub",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop",
    address: "217 E St, Davis, CA 95616",
    hours: "11am - 1am",
    tags: ["Irish Pub", "Live Music", "Whiskey"],
    coordinates: { lat: 38.5441, lng: -121.7399 },
    liveStatus: {
      waitTime: "30m+",
      crowdLevel: "Packed",
      vibe: "🔥",
      lastUpdated: "3 min ago",
    },
    comments: [
      { id: "1", text: "Live band is incredible 🎸", time: "1m ago", vibe: "🔥" },
      { id: "2", text: "Worth the wait for sure", time: "10m ago", vibe: "🔥" },
      { id: "3", text: "Packed but vibes are immaculate", time: "18m ago", vibe: "💃" },
    ],
  },
};

export default function BarDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const bar = id ? mockBarsData[id] : null;

  if (!bar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Bar not found</h2>
          <Button onClick={() => navigate("/dashboard")}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Image */}
      <div className="relative h-56">
        <img
          src={bar.image}
          alt={bar.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Header Actions */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full glass-strong"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full glass-strong"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full glass-strong"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="px-4 -mt-8 relative z-10 space-y-6">
        {/* Bar Info */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{bar.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{bar.address}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{bar.hours}</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {bar.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Live Status Card */}
        <LiveStatusCard
          waitTime={bar.liveStatus.waitTime}
          crowdLevel={bar.liveStatus.crowdLevel}
          vibe={bar.liveStatus.vibe}
          lastUpdated={bar.liveStatus.lastUpdated}
        />

        {/* Live Wall */}
        <LiveWall comments={bar.comments} />
      </main>

      {/* Floating Report Button */}
      <Button
        onClick={() => setIsReportOpen(true)}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 h-14 px-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold shadow-lg shadow-neon-purple/30 hover:shadow-neon-purple/50 transition-all"
      >
        <Users className="h-5 w-5 mr-2" />
        Report the Move
      </Button>

      {/* Report Drawer */}
      <ReportDrawer
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        barName={bar.name}
        barCoordinates={bar.coordinates}
      />

      <BottomNav />
    </div>
  );
}
