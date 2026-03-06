import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
}

const steps = [
  { num: 1, label: "Trip Details" },
  { num: 2, label: "Budget Split" },
  { num: 3, label: "Feasibility" },
];

const StepProgress = ({ currentStep }: StepProgressProps) => {
  return (
    <div className="flex items-center justify-center gap-0 py-6 px-4">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                currentStep > step.num
                  ? "bg-green-500 text-white"
                  : currentStep === step.num
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-muted-foreground/30 text-muted-foreground"
              )}
            >
              {currentStep > step.num ? <Check className="h-4 w-4" /> : step.num}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                currentStep >= step.num ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-16 md:w-24 h-0.5 mx-2 mb-5 transition-all",
                currentStep > step.num ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepProgress;
