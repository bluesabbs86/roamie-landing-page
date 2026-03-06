import { useEffect, useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import type { TripData } from "./Step1TripDetails";
import type { Allocations } from "./Step2BudgetSplit";
import { useNavigate } from "react-router-dom";

interface Step3Props {
  tripData: TripData;
  allocations: Allocations;
  onBack: () => void;
}

interface FeasibilityResult {
  feasibility: "comfortable" | "tight" | "over-budget";
  flightEstimate: string;
  hotelEstimate: string;
  activitiesNote: string;
  verdict: string;
  tip: string;
}

const Step3Feasibility = ({ tripData, allocations, onBack }: Step3Props) => {
  const { selectedCurrency } = useCurrency();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<FeasibilityResult | null>(null);
  const [error, setError] = useState(false);

  const fetchFeasibility = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "trip-feasibility",
        {
          body: {
            departure: tripData.departure,
            destination: tripData.destination,
            checkIn: tripData.checkIn,
            checkOut: tripData.checkOut,
            nights: tripData.nights,
            adults: tripData.adults,
            children: tripData.children,
            totalBudget: tripData.totalBudget,
            currencySymbol: selectedCurrency.symbol,
            currencyCode: selectedCurrency.code,
            allocations,
          },
        }
      );

      if (fnError) throw fnError;
      console.log("Feasibility result:", data);
      setResult(data as FeasibilityResult);
    } catch (e) {
      console.error("Feasibility error:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeasibility();
  }, []);

  const handleStartTracking = () => {
    localStorage.setItem(
      "roamie:trip",
      JSON.stringify({
        ...tripData,
        allocations,
        feasibility: result?.feasibility,
        verdict: result?.verdict,
      })
    );
    localStorage.setItem("roamie:currency", JSON.stringify(selectedCurrency));
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
        <span className="font-display text-lg font-bold text-primary animate-pulse">
          Roamie
        </span>
        <p className="text-muted-foreground text-sm">
          Roamie is crunching your budget... 🧡
        </p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-[500px] mx-auto text-center py-16">
        <div className="bg-card rounded-2xl shadow-md p-8">
          <p className="text-lg font-display font-bold text-foreground mb-4">
            Roamie hit a snag loading your feasibility check 😅
          </p>
          <Button
            onClick={fetchFeasibility}
            className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full px-8"
          >
            Try again 🔄
          </Button>
        </div>
      </div>
    );
  }

  const badgeConfig = {
    comfortable: {
      bg: "bg-green-500",
      text: "text-white",
      label: "✅ Comfortable",
    },
    tight: {
      bg: "bg-amber-400",
      text: "text-foreground",
      label: "⚠️ Tight but doable",
    },
    "over-budget": {
      bg: "bg-destructive",
      text: "text-white",
      label: "❌ Over Budget",
    },
  };

  const badge = badgeConfig[result.feasibility] || badgeConfig.tight;

  return (
    <div className="w-full max-w-[600px] mx-auto space-y-6">
      {/* Feasibility Badge */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="text-center"
      >
        <span
          className={`inline-block ${badge.bg} ${badge.text} text-lg font-bold px-8 py-3 rounded-full shadow-md`}
        >
          {badge.label}
        </span>
      </motion.div>

      {/* Estimates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl shadow-md p-4 text-center">
          <span className="text-2xl">✈️</span>
          <p className="text-xs text-muted-foreground mt-1">Flight Estimate</p>
          <p className="font-bold text-foreground text-sm mt-1">
            {result.flightEstimate}
          </p>
        </div>
        <div className="bg-card rounded-2xl shadow-md p-4 text-center">
          <span className="text-2xl">🏨</span>
          <p className="text-xs text-muted-foreground mt-1">Hotel / Night</p>
          <p className="font-bold text-foreground text-sm mt-1">
            {result.hotelEstimate}
          </p>
        </div>
        <div className="bg-card rounded-2xl shadow-md p-4 text-center">
          <span className="text-2xl">🎯</span>
          <p className="text-xs text-muted-foreground mt-1">Activities</p>
          <p className="font-bold text-foreground text-sm mt-1">
            {result.activitiesNote}
          </p>
        </div>
      </div>

      {/* Verdict */}
      <div className="bg-accent border-l-4 border-primary rounded-2xl p-5">
        <p className="text-foreground font-medium">{result.verdict}</p>
        <p className="text-sm text-muted-foreground italic mt-2">— Roamie 🧡</p>
      </div>

      {/* Tip */}
      <div className="bg-card rounded-2xl shadow-md p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-bold text-foreground text-sm">
              Roamie's top tip for {tripData.destination}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{result.tip}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic text-center">
        Estimates are approximate and based on typical prices. Always verify
        before booking.
      </p>

      {/* CTAs */}
      <div className="space-y-3">
        <Button
          onClick={handleStartTracking}
          className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full py-6 text-base font-bold shadow-lg"
        >
          Start tracking my budget →
        </Button>
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full rounded-full text-muted-foreground"
        >
          ← Adjust my budget
        </Button>
      </div>
    </div>
  );
};

export default Step3Feasibility;
