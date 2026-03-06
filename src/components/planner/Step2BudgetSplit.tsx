import { useState, useCallback } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { TripData } from "./Step1TripDetails";

interface Step2Props {
  tripData: TripData;
  onNext: (allocations: Allocations) => void;
  onBack: () => void;
}

export interface Allocations {
  flights: { percent: number; amount: number };
  hotel: { percent: number; amount: number };
  activities: { percent: number; amount: number };
  food: { percent: number; amount: number };
}

const categories = [
  { key: "flights", icon: "✈️", label: "Flights" },
  { key: "hotel", icon: "🏨", label: "Hotel" },
  { key: "activities", icon: "🎯", label: "Activities" },
  { key: "food", icon: "🍽️", label: "Food & Misc" },
] as const;

type CatKey = (typeof categories)[number]["key"];

const Step2BudgetSplit = ({ tripData, onNext, onBack }: Step2Props) => {
  const { selectedCurrency } = useCurrency();
  const [percents, setPercents] = useState<Record<CatKey, number>>({
    flights: 35,
    hotel: 40,
    activities: 15,
    food: 10,
  });

  const handleSlider = useCallback(
    (changedKey: CatKey, newVal: number) => {
      const clamped = Math.min(85, Math.max(0, newVal));
      const oldVal = percents[changedKey];
      const diff = clamped - oldVal;

      const otherKeys = (Object.keys(percents) as CatKey[]).filter(
        (k) => k !== changedKey
      );
      const otherTotal = otherKeys.reduce((s, k) => s + percents[k], 0);

      const newPercents = { ...percents, [changedKey]: clamped };

      if (otherTotal > 0) {
        let remaining = -diff;
        otherKeys.forEach((k) => {
          const proportion = percents[k] / otherTotal;
          let adjusted = percents[k] + remaining * proportion;
          adjusted = Math.min(85, Math.max(0, Math.round(adjusted)));
          newPercents[k] = adjusted;
        });

        // Fix rounding
        const total = Object.values(newPercents).reduce((s, v) => s + v, 0);
        if (total !== 100) {
          const fixKey = otherKeys[0];
          newPercents[fixKey] = Math.max(0, Math.min(85, newPercents[fixKey] + (100 - total)));
        }
      }

      setPercents(newPercents);
    },
    [percents]
  );

  const total = Object.values(percents).reduce((s, v) => s + v, 0);

  const handleNext = () => {
    const alloc: Allocations = {
      flights: {
        percent: percents.flights,
        amount: Math.round(tripData.totalBudget * (percents.flights / 100)),
      },
      hotel: {
        percent: percents.hotel,
        amount: Math.round(tripData.totalBudget * (percents.hotel / 100)),
      },
      activities: {
        percent: percents.activities,
        amount: Math.round(tripData.totalBudget * (percents.activities / 100)),
      },
      food: {
        percent: percents.food,
        amount: Math.round(tripData.totalBudget * (percents.food / 100)),
      },
    };
    onNext(alloc);
  };

  return (
    <div className="w-full max-w-[600px] mx-auto">
      {/* Summary strip */}
      <div className="bg-accent rounded-2xl px-4 py-3 mb-6 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-foreground font-medium">
          🛫 {tripData.departure} → {tripData.destination} · ✈️ {tripData.nights} night
          {tripData.nights !== 1 ? "s" : ""} · 👥{" "}
          {tripData.adults + tripData.children} traveller
          {tripData.adults + tripData.children !== 1 ? "s" : ""} ·{" "}
          💰 {selectedCurrency.symbol}
          {tripData.totalBudget.toLocaleString()}
        </p>
        <button
          onClick={onBack}
          className="text-sm text-primary font-medium hover:underline"
        >
          ← Edit
        </button>
      </div>

      <div className="text-center mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">
          Here's how Roamie suggests splitting your budget 🧡
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Drag the sliders to make them yours — just keep it at 100%
        </p>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {categories.map((cat) => {
          const pct = percents[cat.key];
          const amount = Math.round(tripData.totalBudget * (pct / 100));
          return (
            <div
              key={cat.key}
              className="bg-card rounded-2xl shadow-md p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-semibold text-foreground">{cat.label}</span>
                </div>
                <span className="bg-accent text-primary text-sm font-bold px-2 py-0.5 rounded-full">
                  {pct}%
                </span>
              </div>
              <p className="text-xl font-bold text-foreground mb-3">
                {selectedCurrency.symbol}
                {amount.toLocaleString()}
              </p>
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <Slider
                value={[pct]}
                min={0}
                max={85}
                step={1}
                onValueChange={([v]) => handleSlider(cat.key, v)}
              />
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="text-center mb-4">
        <span
          className={`text-sm font-bold ${
            total === 100 ? "text-green-500" : "text-destructive"
          }`}
        >
          Total: {total}%
        </span>
      </div>

      <p className="text-xs text-muted-foreground italic text-center mb-6">
        These are Roamie's smart suggestions — drag to make them yours.
      </p>

      <Button
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full py-6 text-base font-bold shadow-lg"
      >
        Looks good — check if it's feasible →
      </Button>
    </div>
  );
};

export default Step2BudgetSplit;
