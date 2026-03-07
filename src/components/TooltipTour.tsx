import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface TooltipTourProps {
  steps: TourStep[];
  tourKey: string; // unique key per page to track completion
}

const TOUR_STORAGE_KEY = "roamie:tour-completed";

const TooltipTour = ({ steps, tourKey }: TooltipTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const [actualPosition, setActualPosition] = useState<"top" | "bottom">("bottom");

  useEffect(() => {
    try {
      const completed = JSON.parse(localStorage.getItem(TOUR_STORAGE_KEY) || "{}");
      if (!completed[tourKey]) {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [tourKey]);

  const positionTooltip = useCallback(() => {
    if (!isVisible || !steps[currentStep]) return;
    const step = steps[currentStep];
    const el = document.querySelector(step.target);
    if (!el) return;

    // Scroll into view first, then position after scroll settles
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Delay position calculation to allow scroll to complete
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const tooltipWidth = 300;
      const tooltipHeight = 160;
      const padding = 12;

      let top = 0;
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      let position: "top" | "bottom" = "bottom";

      // Prefer below, fall back to above
      if (rect.bottom + tooltipHeight + padding < window.innerHeight) {
        top = rect.bottom + padding;
        position = "bottom";
      } else {
        top = rect.top - tooltipHeight - padding;
        position = "top";
      }

      // Clamp horizontally
      left = Math.max(12, Math.min(left, window.innerWidth - tooltipWidth - 12));
      // Clamp vertically
      top = Math.max(12, Math.min(top, window.innerHeight - tooltipHeight - 12));

      setActualPosition(position);
      setTooltipStyle({
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        width: `${tooltipWidth}px`,
        zIndex: 10001,
      });

      // Arrow pointing at target
      const arrowLeft = Math.max(20, Math.min(rect.left + rect.width / 2 - left, tooltipWidth - 20));
      setArrowStyle({
        position: "absolute",
        left: `${arrowLeft}px`,
        ...(position === "bottom"
          ? { top: "-6px" }
          : { bottom: "-6px" }),
      });
    }, 500);
  }, [isVisible, currentStep, steps]);

  useEffect(() => {
    positionTooltip();
    window.addEventListener("resize", positionTooltip);
    window.addEventListener("scroll", positionTooltip, true);
    return () => {
      window.removeEventListener("resize", positionTooltip);
      window.removeEventListener("scroll", positionTooltip, true);
    };
  }, [positionTooltip]);

  const completeTour = useCallback(() => {
    setIsVisible(false);
    try {
      const completed = JSON.parse(localStorage.getItem(TOUR_STORAGE_KEY) || "{}");
      completed[tourKey] = true;
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(completed));
    } catch {}
  }, [tourKey]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  if (!isVisible || !steps[currentStep]) return null;

  const step = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-[10000]"
        onClick={completeTour}
      />

      {/* Highlight ring on target */}
      <HighlightRing target={step.target} />

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: actualPosition === "bottom" ? -8 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={tooltipStyle}
          className="rounded-2xl bg-card border border-border shadow-xl p-4"
        >
          {/* Arrow */}
          <div
            style={arrowStyle}
            className={`w-3 h-3 rotate-45 bg-card border border-border ${
              actualPosition === "bottom"
                ? "border-b-0 border-r-0"
                : "border-t-0 border-l-0"
            }`}
          />

          {/* Close */}
          <button
            onClick={completeTour}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="pr-6">
            <h4 className="font-display font-bold text-foreground text-sm mb-1">{step.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-[10px] text-muted-foreground font-medium">
              {currentStep + 1} / {steps.length}
            </span>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrev}
                  className="h-7 px-2 text-xs rounded-full"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleNext}
                className="h-7 px-3 text-xs rounded-full bg-primary text-primary-foreground"
              >
                {currentStep === steps.length - 1 ? "Got it!" : "Next"}
                {currentStep < steps.length - 1 && <ArrowRight className="h-3 w-3 ml-1" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

/** Renders a pulsing highlight ring around the target element */
const HighlightRing = ({ target }: { target: string }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const update = () => {
      const el = document.querySelector(target);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setStyle({
        position: "fixed",
        top: rect.top - 4,
        left: rect.left - 4,
        width: rect.width + 8,
        height: rect.height + 8,
        zIndex: 10000,
        pointerEvents: "none",
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [target]);

  return (
    <motion.div
      style={style}
      className="rounded-xl border-2 border-primary"
      animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.4)", "0 0 0 8px hsl(var(--primary) / 0)", "0 0 0 0 hsl(var(--primary) / 0.4)"] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
};

export default TooltipTour;
