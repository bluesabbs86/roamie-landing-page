import { useState } from "react";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import PlannerNavbar from "@/components/planner/PlannerNavbar";
import NextStepGuide from "@/components/NextStepGuide";
import StepProgress from "@/components/planner/StepProgress";
import Step1TripDetails, { TripData } from "@/components/planner/Step1TripDetails";
import Step2BudgetSplit, { Allocations } from "@/components/planner/Step2BudgetSplit";
import Step3Feasibility from "@/components/planner/Step3Feasibility";
import BottomNav from "@/components/dashboard/BottomNav";
import TooltipTour from "@/components/TooltipTour";

const step1Tour = [
  {
    target: "[data-tour='step-progress']",
    title: "Your Planning Journey 📍",
    description: "Follow these 3 steps: set trip details, split your budget, then check feasibility.",
  },
  {
    target: "[data-tour='trip-form']",
    title: "Where are you going? ✈️",
    description: "Fill in your destination, dates, travellers, and total budget to get started.",
  },
  {
    target: "[data-tour='bottom-nav']",
    title: "Navigate Anytime 🧭",
    description: "Use the bottom bar to jump between Plan, Budget, Explore, and your Account.",
  },
];

const TripPlannerInner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [allocations, setAllocations] = useState<Allocations | null>(null);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PlannerNavbar />
      {currentStep === 1 && (
        <TooltipTour steps={step1Tour} tourKey="planner" />
      )}
      <div data-tour="step-progress">
        <StepProgress currentStep={currentStep} />
      </div>
      <div className="px-4 pb-12">
        {currentStep === 1 && (
          <div className="animate-in slide-in-from-right-5 duration-300" data-tour="trip-form">
            <Step1TripDetails
              onNext={(data) => {
                setTripData(data);
                setCurrentStep(2);
              }}
            />
          </div>
        )}
        {currentStep === 2 && tripData && (
          <div className="animate-in slide-in-from-right-5 duration-300">
            <Step2BudgetSplit
              tripData={tripData}
              onNext={(alloc) => {
                setAllocations(alloc);
                setCurrentStep(3);
              }}
              onBack={() => setCurrentStep(1)}
            />
          </div>
        )}
        {currentStep === 3 && tripData && allocations && (
          <div className="animate-in fade-in duration-300">
            <Step3Feasibility
              tripData={tripData}
              allocations={allocations}
              onBack={() => setCurrentStep(2)}
            />
            <div className="max-w-xl mx-auto mt-6">
              <NextStepGuide
                emoji="📊"
                message="Your plan is set! Next, track your spending"
                ctaLabel="Open Dashboard"
                href="/dashboard"
              />
            </div>
          </div>
        )}
      </div>
      <div data-tour="bottom-nav">
        <BottomNav />
      </div>
    </div>
  );
};

const TripPlanner = () => (
  <CurrencyProvider>
    <TripPlannerInner />
  </CurrencyProvider>
);

export default TripPlanner;
