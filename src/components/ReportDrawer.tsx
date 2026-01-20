import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  barName: string;
  barCoordinates: { lat: number; lng: number };
}

const waitTimeOptions = ["0-10m", "10-30m", "30m+"];
const vibeOptions = [
  { emoji: "🔥", label: "Fire" },
  { emoji: "😴", label: "Chill" },
  { emoji: "💃", label: "Dancing" },
];
const crowdOptions = ["Quiet", "Vibe", "Packed"];

// Calculate distance between two coordinates in meters using Haversine formula
function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function ReportDrawer({ isOpen, onClose, barName, barCoordinates }: ReportDrawerProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedWaitTime, setSelectedWaitTime] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedCrowd, setSelectedCrowd] = useState<string | null>(null);

  const verifyLocation = () => {
    setIsVerifying(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsVerifying(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = getDistanceInMeters(
          position.coords.latitude,
          position.coords.longitude,
          barCoordinates.lat,
          barCoordinates.lng
        );

        if (distance <= 50) {
          setIsVerified(true);
          toast.success("Location verified! You're at the bar.");
        } else {
          toast.error("You must be at the bar to verify the move.", {
            description: `You're ${Math.round(distance)}m away. Get within 50m to report.`,
            icon: <AlertCircle className="h-5 w-5" />,
          });
        }
        setIsVerifying(false);
      },
      (error) => {
        let message = "Unable to get your location";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Please enable location access to verify";
        }
        toast.error(message);
        setIsVerifying(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = () => {
    if (!selectedWaitTime || !selectedVibe || !selectedCrowd) {
      toast.error("Please fill in all fields");
      return;
    }

    // Here you would submit to the backend
    toast.success("Thanks for reporting the move! 🎉", {
      description: "Your update will help others tonight.",
    });
    
    // Reset and close
    setIsVerified(false);
    setSelectedWaitTime(null);
    setSelectedVibe(null);
    setSelectedCrowd(null);
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsVerified(false);
      setSelectedWaitTime(null);
      setSelectedVibe(null);
      setSelectedCrowd(null);
      onClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl font-bold">Report the Move</DrawerTitle>
          <DrawerDescription>
            Share what's happening at {barName}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-6 overflow-y-auto">
          {!isVerified ? (
            // GPS Verification Step
            <div className="flex flex-col items-center text-center py-8 space-y-4">
              <div className="h-20 w-20 rounded-full bg-neon-purple/10 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-neon-purple" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">Verify Your Location</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  To keep reports authentic, we need to confirm you're at {barName}.
                </p>
              </div>
              <Button
                onClick={verifyLocation}
                disabled={isVerifying}
                className="w-full max-w-xs h-12 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <MapPin className="h-5 w-5 mr-2" />
                    Verify I'm Here
                  </>
                )}
              </Button>
            </div>
          ) : (
            // Report Form
            <div className="space-y-6">
              {/* Verified Badge */}
              <div className="flex items-center justify-center gap-2 py-2 px-4 bg-green-500/10 rounded-lg text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Location Verified</span>
              </div>

              {/* Wait Time */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground">Wait Time</h4>
                <div className="grid grid-cols-3 gap-2">
                  {waitTimeOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedWaitTime(option)}
                      className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                        selectedWaitTime === option
                          ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-white"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vibe */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground">Vibe</h4>
                <div className="grid grid-cols-3 gap-2">
                  {vibeOptions.map((option) => (
                    <button
                      key={option.emoji}
                      onClick={() => setSelectedVibe(option.emoji)}
                      className={`py-3 px-4 rounded-xl text-center transition-all ${
                        selectedVibe === option.emoji
                          ? "bg-gradient-to-r from-neon-purple to-neon-cyan"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{option.emoji}</span>
                      <span className={`text-xs ${selectedVibe === option.emoji ? "text-white" : "text-muted-foreground"}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crowd */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground">Crowd Level</h4>
                <div className="grid grid-cols-3 gap-2">
                  {crowdOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedCrowd(option)}
                      className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                        selectedCrowd === option
                          ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-white"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {isVerified && (
          <DrawerFooter>
            <Button
              onClick={handleSubmit}
              className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold"
            >
              Submit Report
            </Button>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
