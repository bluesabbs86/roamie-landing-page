import { useState, useEffect, useMemo } from "react";
import { useSyncTripData } from "@/hooks/useSyncTripData";
import { useNavigate } from "react-router-dom";
import { Currency, currencies } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { exportTripPdf } from "@/lib/exportPdf";
import ExploreLoadingAnimation from "@/components/explore/ExploreLoadingAnimation";
import ExploreNavbar from "@/components/explore/ExploreNavbar";
import ExploreHeader from "@/components/explore/ExploreHeader";
import TierSelector from "@/components/explore/TierSelector";
import RecommendationCard from "@/components/explore/RecommendationCard";
import InsiderTips from "@/components/explore/InsiderTips";
import ItineraryBuilder from "@/components/explore/ItineraryBuilder";
import ItineraryBudgetSummary from "@/components/explore/ItineraryBudgetSummary";
import BottomNav from "@/components/dashboard/BottomNav";

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

interface TripData {
  departure: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalBudget: number;
  allocations: {
    flights: { percent: number; amount: number };
    hotel: { percent: number; amount: number };
    activities: { percent: number; amount: number };
    food: { percent: number; amount: number };
  };
}

interface Expense {
  id: string;
  category: string;
  amount: number;
}

const Explore = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripData | null>(null);
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [recommendations, setRecommendations] = useState<Activity[]>([]);
  const [itinerary, setItinerary] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeTier, setActiveTier] = useState("budget");

  // Sync trip data from localStorage (on mount + when page regains focus)
  useSyncTripData({ setTrip, setCurrency, setExpenses, setItinerary, setRecommendations });


  const { activitiesAllocated, activitiesSpent, activitiesRemaining, totalSpent, totalRemaining, budgetPerPerson } =
    useMemo(() => {
      if (!trip) return { activitiesAllocated: 0, activitiesSpent: 0, activitiesRemaining: 0, totalSpent: 0, totalRemaining: 0, budgetPerPerson: 0 };
      const activitiesAllocated = trip.allocations.activities.amount;
      const activitiesSpent = expenses.filter((e) => e.category === "activities").reduce((s, e) => s + e.amount, 0);
      const activitiesRemaining = activitiesAllocated - activitiesSpent;
      const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
      const totalRemaining = trip.totalBudget - totalSpent;
      const totalPeople = trip.adults + (trip.children || 0);
      const budgetPerPerson = totalPeople > 0 ? activitiesRemaining / totalPeople : 0;
      return { activitiesAllocated, activitiesSpent, activitiesRemaining, totalSpent, totalRemaining, budgetPerPerson };
    }, [trip, expenses]);

  // Force free tier if budget exhausted
  useEffect(() => {
    if (activitiesRemaining <= 0 && activeTier !== "free") {
      setActiveTier("free");
    }
  }, [activitiesRemaining, activeTier]);

  // Fetch recommendations
  const fetchRecommendations = async () => {
    if (!trip) return;
    setLoading(true);
    setError(false);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("activity-recommendations", {
        body: {
          destination: trip.destination,
          checkIn: trip.checkIn,
          checkOut: trip.checkOut,
          nights: trip.nights,
          adults: trip.adults,
          children: trip.children,
          activitiesRemaining,
          totalRemaining,
          budgetPerPerson,
          currencySymbol: currency.symbol,
          currencyCode: currency.code,
        },
      });
      if (fnError) throw fnError;
      if (Array.isArray(data)) {
        setRecommendations(data);
        localStorage.setItem("roamie:recommendations", JSON.stringify(data));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (e: any) {
      console.error("Recommendations error:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trip && recommendations.length === 0 && !loading && !error) {
      fetchRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip]);

  const tierCounts = useMemo(() => {
    return {
      free: recommendations.filter((r) => r.tier === "free").length,
      budget: recommendations.filter((r) => r.tier === "budget").length,
      splurge: recommendations.filter((r) => r.tier === "splurge").length,
    };
  }, [recommendations]);

  const filteredRecs = useMemo(
    () => recommendations.filter((r) => r.tier === activeTier),
    [recommendations, activeTier]
  );

  const getAssignedDay = (activityId: string): number | null => {
    for (const [key, ids] of Object.entries(itinerary)) {
      if (ids.includes(activityId)) return parseInt(key.replace("day", ""));
    }
    return null;
  };

  const handleAddToDay = (activityId: string, day: number) => {
    const updated = { ...itinerary };
    // Remove from any previous day
    Object.keys(updated).forEach((key) => {
      updated[key] = updated[key].filter((id) => id !== activityId);
    });
    const dayKey = `day${day}`;
    if (!updated[dayKey]) updated[dayKey] = [];
    updated[dayKey].push(activityId);
    setItinerary(updated);
    localStorage.setItem("roamie:itinerary", JSON.stringify(updated));
    toast({ title: `Added to Day ${day}! 🎯` });
  };

  const handleRemoveFromDay = (activityId: string, day: number) => {
    const updated = { ...itinerary };
    const dayKey = `day${day}`;
    if (updated[dayKey]) {
      updated[dayKey] = updated[dayKey].filter((id) => id !== activityId);
    }
    setItinerary(updated);
    localStorage.setItem("roamie:itinerary", JSON.stringify(updated));
  };

  const handleReorder = (dayKey: string, newOrder: string[]) => {
    const updated = { ...itinerary, [dayKey]: newOrder };
    setItinerary(updated);
    localStorage.setItem("roamie:itinerary", JSON.stringify(updated));
  };

  const totalPlannedCost = useMemo(() => {
    if (!trip) return 0;
    const totalPeople = trip.adults + (trip.children || 0);
    let total = 0;
    Object.values(itinerary).forEach((ids) => {
      ids.forEach((id) => {
        const act = recommendations.find((r) => r.id === id);
        if (act) total += act.estimatedCostPerPerson * totalPeople;
      });
    });
    return total;
  }, [itinerary, recommendations, trip]);

  const handleRefresh = () => {
    localStorage.removeItem("roamie:recommendations");
    setRecommendations([]);
    fetchRecommendations();
  };

  // Empty state
  if (!trip) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <span className="text-6xl mb-4">🗺️</span>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">No trip planned yet!</h2>
        <p className="text-muted-foreground mb-6">Set up your trip first to get personalised recommendations.</p>
        <Button
          onClick={() => navigate("/plan")}
          className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full px-8 py-3 font-bold"
        >
          Plan a trip with Roamie →
        </Button>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <ExploreNavbar
        destination={trip.destination}
        activitiesRemaining={activitiesRemaining}
        totalRemaining={totalRemaining}
        totalBudget={trip.totalBudget}
        currency={currency}
      />

      <ExploreHeader
        destination={trip.destination}
        activitiesRemaining={activitiesRemaining}
        totalRemaining={totalRemaining}
        totalPlannedCost={totalPlannedCost}
        currency={currency}
      />

      <div className="max-w-5xl mx-auto px-4 space-y-6 mt-4">
        {/* Tier Selector */}
        <TierSelector
          activeTier={activeTier}
          onTierChange={setActiveTier}
          counts={tierCounts}
          activitiesRemaining={activitiesRemaining}
        />

        {/* Recommendations Grid */}
        {loading ? (
          <ExploreLoadingAnimation destination={trip.destination} />
        ) : error ? (
          <div className="text-center py-12">
            <span className="text-5xl">😅</span>
            <p className="font-display font-bold text-foreground mt-3">
              Roamie couldn't load recommendations right now
            </p>
            <Button
              onClick={() => {
                localStorage.removeItem("roamie:recommendations");
                setRecommendations([]);
                fetchRecommendations();
              }}
              className="mt-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full"
            >
              Try again 🔄
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecs.map((act, i) => (
              <RecommendationCard
                key={act.id}
                activity={act}
                currency={currency}
                assignedDay={getAssignedDay(act.id)}
                totalDays={trip.nights}
                tripCheckIn={trip.checkIn}
                onAddToDay={handleAddToDay}
                animationDelay={i * 50}
              />
            ))}
            {filteredRecs.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No {activeTier} activities found. Try another tier!
              </div>
            )}
          </div>
        )}

        {/* Insider Tips */}
        {recommendations.length > 0 && (
          <InsiderTips destination={trip.destination} recommendations={recommendations} />
        )}

        {/* Itinerary Builder */}
        {recommendations.length > 0 && (
          <ItineraryBuilder
            nights={trip.nights}
            checkIn={trip.checkIn}
            currency={currency}
            itinerary={itinerary}
            recommendations={recommendations}
            adults={trip.adults}
            children={trip.children}
            destination={trip.destination}
            onRemoveFromDay={handleRemoveFromDay}
            onReorder={handleReorder}
            onAddCustomActivity={(activity, day) => {
              const fullActivity: Activity = {
                ...activity,
                tier: activity.estimatedCostPerPerson === 0 ? "free" : "budget",
                description: "Custom activity",
                currency: currency.code,
                bestTime: "Anytime",
                localTip: "",
                mapsQuery: `${activity.name} ${trip.destination}`,
              };
              setRecommendations((prev) => [...prev, fullActivity]);
              handleAddToDay(fullActivity.id, day);
            }}
          />
        )}

        {/* Itinerary Budget Summary */}
        {recommendations.length > 0 && (
          <ItineraryBudgetSummary
            activitiesAllocated={activitiesAllocated}
            totalPlannedCost={totalPlannedCost}
            currency={currency}
          />
        )}

        {/* Export Itinerary PDF */}
        {recommendations.length > 0 && totalPlannedCost > 0 && (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-5 text-center space-y-3">
            <h2 className="font-display text-lg font-bold text-foreground">📥 Export Your Itinerary</h2>
            <p className="text-sm text-muted-foreground">
              Download a PDF with your trip details, budget breakdown, and day-by-day activities with locations and costs.
            </p>
            <Button
              onClick={() =>
                exportTripPdf({
                  trip: {
                    ...trip,
                    allocations: trip.allocations,
                  },
                  currency,
                  itinerary,
                  recommendations: recommendations.map((r) => ({
                    id: r.id,
                    name: r.name,
                    estimatedCostPerPerson: r.estimatedCostPerPerson,
                    duration: r.duration,
                    mapsQuery: r.mapsQuery,
                    category: r.category,
                  })),
                })
              }
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full px-8 font-bold"
            >
              📥 Download Itinerary PDF
            </Button>
          </div>
        )}

        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-center">
          <h3 className="font-display text-xl font-bold text-primary-foreground mb-1">
            Ready to log your actual spends? 💸
          </h3>
          <p className="text-primary-foreground/80 text-sm mb-4">
            Head to your dashboard to track what you really spend on activities.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-primary hover:bg-white/90 rounded-full font-bold px-6"
            >
              Go to Budget Dashboard →
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-full"
            >
              🔄 Refresh Recommendations
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground italic text-center pb-4">
          Recommendations are AI-generated and approximate. Always verify before booking.
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Explore;
