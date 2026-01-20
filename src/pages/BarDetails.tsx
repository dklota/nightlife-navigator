import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users, Share2, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { ReportDrawer } from "@/components/ReportDrawer";
import { LiveStatusCard } from "@/components/LiveStatusCard";
import { LiveWall } from "@/components/LiveWall";
import { useState } from "react";

// Mock bar data - updated with real Davis bars
const mockBarsData: Record<string, {
  id: string;
  name: string;
  image: string;
  address: string;
  hours: string;
  tags: string[];
  liveStatus: {
    waitTime: string;
    crowdLevel: string;
    vibe: string;
    lastUpdated: string;
  };
  comments: { id: string; text: string; time: string; vibe: string }[];
}> = {
  "g-street-wonders": {
    id: "g-street-wonders",
    name: "G Street WunderBar",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=400&fit=crop",
    address: "228 G St, Davis, CA 95616",
    hours: "5pm - 2am",
    tags: ["Cocktails", "DJ", "Dancing"],
    liveStatus: {
      waitTime: "30m+",
      crowdLevel: "Packed",
      vibe: "🔥",
      lastUpdated: "2 min ago",
    },
    comments: [
      { id: "1", text: "DJ is going OFF right now! 🎧", time: "1m ago", vibe: "🔥" },
      { id: "2", text: "Long line but worth the wait", time: "5m ago", vibe: "💃" },
      { id: "3", text: "Best cocktails in Davis hands down", time: "12m ago", vibe: "🍻" },
    ],
  },
  "froggys": {
    id: "froggys",
    name: "Froggy's Bar & Grill",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop",
    address: "815 2nd St, Davis, CA 95616",
    hours: "11am - 2am",
    tags: ["Sports Bar", "Late Night", "Food"],
    liveStatus: {
      waitTime: "10-30m",
      crowdLevel: "High",
      vibe: "💃",
      lastUpdated: "8 min ago",
    },
    comments: [
      { id: "1", text: "Game night vibes! Lakers up 🏀", time: "3m ago", vibe: "🔥" },
      { id: "2", text: "Wings are 🔥 tonight", time: "15m ago", vibe: "🍻" },
    ],
  },
  "sophias-bar": {
    id: "sophias-bar",
    name: "Sophia's Thai Bar",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop",
    address: "129 E St, Davis, CA 95616",
    hours: "4pm - 12am",
    tags: ["Cocktails", "Chill", "Thai Food"],
    liveStatus: {
      waitTime: "0-10m",
      crowdLevel: "Vibe",
      vibe: "🍻",
      lastUpdated: "5 min ago",
    },
    comments: [
      { id: "1", text: "Chill vibes, great for a date 💕", time: "10m ago", vibe: "🧊" },
      { id: "2", text: "Thai iced tea cocktail is insane", time: "20m ago", vibe: "🍻" },
    ],
  },
  "university-beer-garden": {
    id: "university-beer-garden",
    name: "University Beer Garden",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&h=400&fit=crop",
    address: "326 G St, Davis, CA 95616",
    hours: "12pm - 2am",
    tags: ["Beer Garden", "Live Music", "Outdoor"],
    liveStatus: {
      waitTime: "30m+",
      crowdLevel: "Packed",
      vibe: "🔥",
      lastUpdated: "1 min ago",
    },
    comments: [
      { id: "1", text: "LIVE BAND IS INSANE 🎸🔥", time: "30s ago", vibe: "🔥" },
      { id: "2", text: "45 min wait but totally worth it", time: "8m ago", vibe: "💃" },
      { id: "3", text: "Best outdoor spot in Davis", time: "22m ago", vibe: "🍻" },
    ],
  },
  "deveres-irish-pub": {
    id: "deveres-irish-pub",
    name: "de Vere's Irish Pub",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
    address: "217 E St, Davis, CA 95616",
    hours: "11am - 1am",
    tags: ["Irish Pub", "Whiskey", "Live Music"],
    liveStatus: {
      waitTime: "10-30m",
      crowdLevel: "High",
      vibe: "💃",
      lastUpdated: "6 min ago",
    },
    comments: [
      { id: "1", text: "Irish music night! 🍀", time: "4m ago", vibe: "💃" },
      { id: "2", text: "Guinness is pouring perfect", time: "18m ago", vibe: "🍻" },
    ],
  },
  "the-graduate": {
    id: "the-graduate",
    name: "The Graduate",
    image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=400&fit=crop",
    address: "805 Russell Blvd, Davis, CA 95616",
    hours: "4pm - 2am",
    tags: ["Pool", "Dive Bar", "Cheap Drinks"],
    liveStatus: {
      waitTime: "0-10m",
      crowdLevel: "Vibe",
      vibe: "🧊",
      lastUpdated: "15 min ago",
    },
    comments: [
      { id: "1", text: "Pool tables open, chill crowd", time: "12m ago", vibe: "🧊" },
      { id: "2", text: "$3 wells all night 💰", time: "25m ago", vibe: "🍻" },
    ],
  },
  "woodstocks-pizza": {
    id: "woodstocks-pizza",
    name: "Woodstock's Pizza",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop",
    address: "219 G St, Davis, CA 95616",
    hours: "11am - 2am",
    tags: ["Pizza", "Beer Garden", "Late Night"],
    liveStatus: {
      waitTime: "10-30m",
      crowdLevel: "High",
      vibe: "🔥",
      lastUpdated: "5 min ago",
    },
    comments: [
      { id: "1", text: "Line is moving fast tonight! 🍕", time: "2m ago", vibe: "🔥" },
      { id: "2", text: "Great energy, DJ is fire", time: "8m ago", vibe: "💃" },
      { id: "3", text: "Grab a spot on the patio if you can", time: "15m ago", vibe: "🔥" },
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
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 h-14 px-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold shadow-lg shadow-neon-purple/30 hover:shadow-neon-purple/50 transition-all animate-glow-pulse"
      >
        <Users className="h-5 w-5 mr-2" />
        Report the Move
      </Button>

      {/* Report Drawer - No GPS required */}
      <ReportDrawer
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        barName={bar.name}
      />

      <BottomNav />
    </div>
  );
}
