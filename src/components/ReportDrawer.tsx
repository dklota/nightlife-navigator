import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle, Loader2, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

interface ReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  barName: string;
  barCoordinates: { lat: number; lng: number };
}

const waitTimeOptions = ["0-10m", "10-30m", "30m+"];
const crowdOptions = ["Quiet", "Vibe", "Packed"];
const vibeOptions = [
  { emoji: "🔥", label: "Fire" },
  { emoji: "🧊", label: "Cold" },
  { emoji: "😴", label: "Dead" },
  { emoji: "💃", label: "Dancing" },
  { emoji: "🍻", label: "Drinks" },
];

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

type Step = "verify" | "waitTime" | "crowd" | "vibe";

export function ReportDrawer({ isOpen, onClose, barName, barCoordinates }: ReportDrawerProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("verify");
  const [selectedWaitTime, setSelectedWaitTime] = useState<string | null>(null);
  const [selectedCrowd, setSelectedCrowd] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

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
          setCurrentStep("waitTime");
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

  const handleWaitTimeSelect = (option: string) => {
    setSelectedWaitTime(option);
    setCurrentStep("crowd");
  };

  const handleCrowdSelect = (option: string) => {
    setSelectedCrowd(option);
    setCurrentStep("vibe");
  };

  const handleVibeSelect = (emoji: string) => {
    setSelectedVibe(emoji);
    // Submit the report
    toast.success("Thanks for the move! 🎉", {
      description: "Your update helps others find the vibe tonight.",
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    setCurrentStep("verify");
    setSelectedWaitTime(null);
    setSelectedCrowd(null);
    setSelectedVibe(null);
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetAndClose();
    }
  };

  const getStepIndicator = () => {
    const steps = ["waitTime", "crowd", "vibe"] as const;
    const currentIndex = steps.indexOf(currentStep as typeof steps[number]);
    if (currentIndex === -1) return null;
    
    return (
      <div className="flex items-center justify-center gap-2 mb-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`h-2 w-8 rounded-full transition-all ${
              index <= currentIndex
                ? "bg-gradient-to-r from-neon-purple to-neon-cyan"
                : "bg-secondary"
            }`}
          />
        ))}
      </div>
    );
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

        <div className="px-4 pb-8 space-y-6">
          {currentStep === "verify" && (
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
          )}

          {currentStep === "waitTime" && (
            <div className="space-y-6 py-4">
              {getStepIndicator()}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-foreground">How long is the line?</h3>
                <p className="text-sm text-muted-foreground">Select the current wait time</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {waitTimeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleWaitTimeSelect(option)}
                    className="group relative py-6 px-4 rounded-2xl font-bold text-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all active:scale-95"
                  >
                    {option}
                    <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === "crowd" && (
            <div className="space-y-6 py-4">
              {getStepIndicator()}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-foreground">What's the crowd like?</h3>
                <p className="text-sm text-muted-foreground">How busy is it right now?</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {crowdOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleCrowdSelect(option)}
                    className="group relative py-6 px-4 rounded-2xl font-bold text-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all active:scale-95"
                  >
                    {option}
                    <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === "vibe" && (
            <div className="space-y-6 py-4">
              {getStepIndicator()}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-foreground">Pick a Vibe Emoji</h3>
                <p className="text-sm text-muted-foreground">How would you describe the energy?</p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {vibeOptions.map((option) => (
                  <button
                    key={option.emoji}
                    onClick={() => handleVibeSelect(option.emoji)}
                    className="group flex flex-col items-center py-4 px-2 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all active:scale-95"
                  >
                    <span className="text-3xl mb-1">{option.emoji}</span>
                    <span className="text-xs text-muted-foreground">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
