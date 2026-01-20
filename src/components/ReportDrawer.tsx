import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface ReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  barName: string;
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

type Step = "waitTime" | "crowd" | "vibe";

export function ReportDrawer({ isOpen, onClose, barName }: ReportDrawerProps) {
  const [currentStep, setCurrentStep] = useState<Step>("waitTime");
  const [selectedWaitTime, setSelectedWaitTime] = useState<string | null>(null);
  const [selectedCrowd, setSelectedCrowd] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

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
    setCurrentStep("waitTime");
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
    const currentIndex = steps.indexOf(currentStep);
    
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
