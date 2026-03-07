import { useState } from "react";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import PlannerNavbar from "@/components/planner/PlannerNavbar";
import NextStepGuide from "@/components/NextStepGuide";
import StepProgress from "@/components/planner/StepProgress";
import Step1TripDetails, { TripData } from "@/components/planner/Step1TripDetails";
import Step2BudgetSplit, { Allocations } from "@/components/planner/Step2BudgetSplit";
import Step3Feasibility from "@/components/planner/Step3Feasibility";
import BottomNav from "@/components/dashboard/BottomNav";

const TripPlannerInner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [allocations, setAllocations] = useState<Allocations | null>(null);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PlannerNavbar />
      <StepProgress currentStep={currentStep} />
      <div className="px-4 pb-12">
        {currentStep === 1 && (
          <div className="animate-in slide-in-from-right-5 duration-300">
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
                onBeforeNavigate={() => {
                  if (tripData && allocations) {
                    const newTripData = {
                      ...tripData,
                      allocations,
                    };
                    try {
                      const oldTrip = JSON.parse(localStorage.getItem("roamie:trip") || "null");
                      if (
                        !oldTrip ||
                        oldTrip.destination !== tripData.destination ||
                        oldTrip.checkIn !== tripData.checkIn ||
                        oldTrip.checkOut !== tripData.checkOut ||
                        oldTrip.nights !== tripData.nights
                      ) {
                        localStorage.removeItem("roamie:recommendations");
                        localStorage.removeItem("roamie:itinerary");
                        localStorage.removeItem("roamie:expenses");
                      }
                    } catch {}
                    localStorage.setItem("roamie:trip", JSON.stringify(newTripData));
                    const currency = localStorage.getItem("roamie:currency");
                    if (!currency) {
                      localStorage.setItem("roamie:currency", JSON.stringify({ code: "GBP", symbol: "£", name: "British Pound" }));
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

const TripPlanner = () => (
  <CurrencyProvider>
    <TripPlannerInner />
  </CurrencyProvider>
);

export default TripPlanner;
