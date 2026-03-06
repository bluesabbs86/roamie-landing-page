import { useState, useRef, useEffect } from "react";
import { Currency } from "@/contexts/CurrencyContext";

interface Activity {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  tier: string;
  description: string;
  estimatedCostPerPerson: number;
  currency: string;
  duration: string;
  bestTime: string;
  localTip: string;
  mapsQuery: string;
}

interface RecommendationCardProps {
  activity: Activity;
  currency: Currency;
  assignedDay: number | null;
  totalDays: number;
  tripCheckIn: string;
  onAddToDay: (activityId: string, day: number) => void;
  animationDelay: number;
}

const tierColors: Record<string, string> = {
  free: "bg-green-500 text-white",
  budget: "bg-cyan-500 text-white",
  splurge: "bg-amber-400 text-foreground",
};

const tierLabels: Record<string, string> = {
  free: "🆓 Free",
  budget: "💚 Budget",
  splurge: "✨ Splurge",
};

const RecommendationCard = ({
  activity,
  currency,
  assignedDay,
  totalDays,
  tripCheckIn,
  onAddToDay,
  animationDelay,
}: RecommendationCardProps) => {
  const [showDayPicker, setShowDayPicker] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowDayPicker(false);
      }
    };
    if (showDayPicker) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDayPicker]);

  const getDayDate = (dayNum: number) => {
    if (!tripCheckIn) return "";
    const d = new Date(tripCheckIn);
    d.setDate(d.getDate() + dayNum - 1);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <div
      className="bg-card rounded-2xl shadow-sm border border-border p-4 flex flex-col gap-3 animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: "both" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm">
            {activity.categoryIcon}
          </span>
          <span className="text-xs text-muted-foreground">{activity.category}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tierColors[activity.tier]}`}>
          {tierLabels[activity.tier]}
        </span>
      </div>

      {/* Body */}
      <h3 className="font-display text-base font-bold text-foreground">{activity.name}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3">
        <span>
          💰 {activity.estimatedCostPerPerson === 0 ? (
            <span className="text-green-600 font-bold">Free</span>
          ) : (
            `${currency.symbol}${activity.estimatedCostPerPerson}/pp`
          )}
        </span>
        <span className="text-border">|</span>
        <span>⏱️ {activity.duration}</span>
        <span className="text-border">|</span>
        <span>🌅 {activity.bestTime}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(activity.mapsQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          📍 View on Maps
        </a>

        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setShowDayPicker(!showDayPicker)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              assignedDay
                ? "bg-primary text-primary-foreground"
                : "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            }`}
          >
            {assignedDay ? `✓ Day ${assignedDay} · Move?` : "+ Add to Itinerary"}
          </button>

          {showDayPicker && (
            <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-xl shadow-lg p-3 z-50 w-56 animate-scale-in">
              <p className="text-xs font-semibold text-foreground mb-2">Add to which day? 📅</p>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() => {
                      onAddToDay(activity.id, day);
                      setShowDayPicker(false);
                    }}
                    className={`px-2 py-1 rounded-lg text-xs transition-all ${
                      assignedDay === day
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-accent"
                    }`}
                  >
                    <div className="font-semibold">Day {day}</div>
                    <div className="text-[9px] opacity-70">{getDayDate(day)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
