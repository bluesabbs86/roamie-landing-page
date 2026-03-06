import { useState } from "react";
import { Currency } from "@/contexts/CurrencyContext";
import { toast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  estimatedCostPerPerson: number;
  duration: string;
}

interface ItineraryBuilderProps {
  nights: number;
  checkIn: string;
  currency: Currency;
  itinerary: Record<string, string[]>;
  recommendations: Activity[];
  adults: number;
  children: number;
  onRemoveFromDay: (activityId: string, day: number) => void;
}

const ItineraryBuilder = ({
  nights,
  checkIn,
  currency,
  itinerary,
  recommendations,
  adults,
  children,
  onRemoveFromDay,
}: ItineraryBuilderProps) => {
  const [activeDay, setActiveDay] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const totalPeople = adults + (children || 0);

  const getDayDate = (dayNum: number) => {
    if (!checkIn) return "";
    const d = new Date(checkIn);
    d.setDate(d.getDate() + dayNum - 1);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  const dayKey = `day${activeDay}`;
  const dayActivityIds = itinerary[dayKey] || [];
  const dayActivities = dayActivityIds
    .map((id) => recommendations.find((r) => r.id === id))
    .filter(Boolean) as Activity[];

  const dayTotal = dayActivities.reduce((s, a) => s + a.estimatedCostPerPerson * totalPeople, 0);

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-foreground mb-4">
        📅 Your {recommendations.length > 0 ? "Itinerary" : "Trip"} Planner
      </h2>

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
        {Array.from({ length: nights }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs transition-all ${
              activeDay === day
                ? "border-b-2 border-primary text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground bg-muted"
            }`}
          >
            <div className="font-bold">Day {day}</div>
            <div className="text-[9px] opacity-70">{getDayDate(day)}</div>
          </button>
        ))}
      </div>

      {/* Day panel */}
      <div className="min-h-[120px]">
        {dayActivities.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl">🎒</span>
            <p className="font-display font-bold text-foreground mt-2">Nothing planned for Day {activeDay} yet</p>
            <p className="text-sm text-muted-foreground">Add activities using the buttons above!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dayActivities.map((act) => (
              <div key={act.id} className="bg-card rounded-xl shadow-sm border border-border p-3 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-sm">
                  {act.categoryIcon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{act.name}</p>
                  <p className="text-xs text-muted-foreground">{act.category} · {act.duration}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-primary">
                    {act.estimatedCostPerPerson === 0 ? "Free" : `${currency.symbol}${(act.estimatedCostPerPerson * totalPeople).toFixed(0)}`}
                  </p>
                  {confirmDelete === act.id ? (
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={() => {
                          onRemoveFromDay(act.id, activeDay);
                          setConfirmDelete(null);
                          toast({ title: `Removed from Day ${activeDay} 🗑️`, variant: "destructive" });
                        }}
                        className="text-[10px] text-red-500 font-semibold"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-[10px] text-muted-foreground"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(act.id)}
                      className="text-xs text-muted-foreground hover:text-red-500 mt-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Day summary */}
            <div className="flex justify-between items-center pt-2 text-sm">
              <span className="font-bold text-primary">Day {activeDay} total: {currency.symbol}{dayTotal.toFixed(0)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryBuilder;
