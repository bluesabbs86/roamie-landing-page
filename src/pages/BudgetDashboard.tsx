import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Currency, currencies } from "@/contexts/CurrencyContext";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import TripHeaderBar from "@/components/dashboard/TripHeaderBar";
import BudgetOverviewCard from "@/components/dashboard/BudgetOverviewCard";
import CategoryCard from "@/components/dashboard/CategoryCard";
import ChartsSection from "@/components/dashboard/ChartsSection";
import ExpenseLog from "@/components/dashboard/ExpenseLog";
import MoneyTipCard from "@/components/dashboard/MoneyTipCard";
import CurrencySwitcherModal from "@/components/dashboard/CurrencySwitcherModal";
import BottomNav from "@/components/dashboard/BottomNav";
import { Button } from "@/components/ui/button";
import { exportTripPdf } from "@/lib/exportPdf";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  dateAdded: string;
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
  feasibility?: string;
  verdict?: string;
}

const categoryMeta = [
  { key: "flights", icon: "✈️", name: "Flights" },
  { key: "hotel", icon: "🏨", name: "Hotel" },
  { key: "activities", icon: "🎯", name: "Activities" },
  { key: "food", icon: "🍽️", name: "Food & Misc" },
];

const BudgetDashboard = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripData | null>(null);
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const t = localStorage.getItem("roamie:trip");
      if (t) setTrip(JSON.parse(t));
    } catch {}
    try {
      const c = localStorage.getItem("roamie:currency");
      if (c) setCurrency(JSON.parse(c));
    } catch {}
    try {
      const e = localStorage.getItem("roamie:expenses");
      if (e) setExpenses(JSON.parse(e));
    } catch {}
  }, []);

  // Persist expenses
  useEffect(() => {
    localStorage.setItem("roamie:expenses", JSON.stringify(expenses));
  }, [expenses]);

  const { totalSpent, spentByCategory } = useMemo(() => {
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const spentByCategory = {
      flights: expenses.filter((e) => e.category === "flights").reduce((s, e) => s + e.amount, 0),
      hotel: expenses.filter((e) => e.category === "hotel").reduce((s, e) => s + e.amount, 0),
      activities: expenses.filter((e) => e.category === "activities").reduce((s, e) => s + e.amount, 0),
      food: expenses.filter((e) => e.category === "food").reduce((s, e) => s + e.amount, 0),
    };
    return { totalSpent, spentByCategory };
  }, [expenses]);

  // Empty state
  if (!trip) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <span className="text-6xl mb-4">🗺️</span>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">No trip planned yet!</h2>
        <p className="text-muted-foreground mb-6">Head back to the planner and set up your trip first.</p>
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

  const handleAddExpense = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCurrencyConvert = (newCurrency: Currency, updatedTrip: TripData, updatedExpenses: Expense[]) => {
    setTrip(updatedTrip);
    setCurrency(newCurrency);
    setExpenses(updatedExpenses);
    localStorage.setItem("roamie:trip", JSON.stringify(updatedTrip));
    localStorage.setItem("roamie:currency", JSON.stringify(newCurrency));
    localStorage.setItem("roamie:expenses", JSON.stringify(updatedExpenses));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardNavbar
        currency={currency}
        feasibility={trip.feasibility}
        onCurrencyChange={() => setCurrencyModalOpen(true)}
      />

      <TripHeaderBar trip={trip} currency={currency} />

      <div className="max-w-5xl mx-auto px-4 space-y-6 mt-6">
        {/* Section 2 — Budget Overview */}
        <BudgetOverviewCard totalBudget={trip.totalBudget} totalSpent={totalSpent} currency={currency} />

        {/* Section 3 — Category Cards */}
        <div>
          <h2 className="font-display text-lg font-bold text-foreground mb-1">
            Spending by Category
          </h2>
          <div className="w-12 h-0.5 bg-primary rounded-full mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryMeta.map((cat) => (
              <CategoryCard
                key={cat.key}
                categoryKey={cat.key}
                icon={cat.icon}
                name={cat.name}
                allocated={trip.allocations[cat.key as keyof typeof trip.allocations].amount}
                spent={spentByCategory[cat.key as keyof typeof spentByCategory]}
                currency={currency}
                onAddExpense={handleAddExpense}
              />
            ))}
          </div>
        </div>

        {/* Section 4 — Charts */}
        <ChartsSection
          allocations={trip.allocations}
          spentByCategory={spentByCategory}
          totalBudget={trip.totalBudget}
          currency={currency}
        />

        {/* Section 5 — Expense Log */}
        <ExpenseLog expenses={expenses} currency={currency} onDelete={handleDeleteExpense} />

        {/* Section 6 — Money Tip */}
        <MoneyTipCard
          destination={trip.destination}
          totalBudget={trip.totalBudget}
          currencySymbol={currency.symbol}
          currencyCode={currency.code}
          nights={trip.nights}
          adults={trip.adults}
          children={trip.children}
          allocations={trip.allocations}
        />

        {/* Export Button */}
        <div className="text-center">
          <button
            onClick={() => {
              let recs: any[] = [];
              try { recs = JSON.parse(localStorage.getItem("roamie:recommendations") || "[]"); } catch {}
              exportTripPdf({
                trip,
                currency,
                expenses,
                itinerary: JSON.parse(localStorage.getItem("roamie:itinerary") || "{}"),
                recommendations: recs,
              });
            }}
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            📥 Export All Data (PDF)
          </button>
        </div>

        <p className="text-xs text-muted-foreground italic text-center pb-4">
          Estimates are approximate. Always verify before booking.
        </p>
      </div>

      <CurrencySwitcherModal
        open={currencyModalOpen}
        onOpenChange={setCurrencyModalOpen}
        currentCurrency={currency}
        trip={trip}
        expenses={expenses}
        onConvert={handleCurrencyConvert}
      />

      <BottomNav />
    </div>
  );
};

export default BudgetDashboard;
