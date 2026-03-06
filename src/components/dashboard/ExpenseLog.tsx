import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Currency } from "@/contexts/CurrencyContext";
import { toast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  dateAdded: string;
}

const categoryIcons: Record<string, string> = {
  flights: "✈️",
  hotel: "🏨",
  activities: "🎯",
  food: "🍽️",
};

const filterPills = [
  { key: "all", label: "All" },
  { key: "flights", label: "✈️ Flights" },
  { key: "hotel", label: "🏨 Hotel" },
  { key: "activities", label: "🎯 Activities" },
  { key: "food", label: "🍽️ Food" },
];

interface Props {
  expenses: Expense[];
  currency: Currency;
  onDelete: (id: string) => void;
}

const ExpenseLog = ({ expenses, currency, onDelete }: Props) => {
  const [filter, setFilter] = useState("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = filter === "all" ? expenses : expenses.filter((e) => e.category === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

  const countFor = (key: string) => (key === "all" ? expenses.length : expenses.filter((e) => e.category === key).length);

  const handleDelete = (id: string) => {
    onDelete(id);
    setConfirmId(null);
    toast({ title: "Expense removed 🗑️", variant: "destructive" });
  };

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-foreground mb-3">Your Spend Log 📋</h2>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filterPills.map((pill) => (
          <button
            key={pill.key}
            onClick={() => setFilter(pill.key)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === pill.key
                ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground border-transparent"
                : "bg-card border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            {pill.label} ({countFor(pill.key)})
          </button>
        ))}
      </div>

      {/* List */}
      {sorted.length === 0 ? (
        <div className="text-center py-10">
          <span className="text-4xl block mb-2">🎒</span>
          <p className="font-display font-bold text-foreground">No spends logged yet — your budget is all yours!</p>
          <p className="text-xs text-muted-foreground mt-1">Use the + Add Expense buttons above to log your spends</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((exp) => (
            <div key={exp.id}>
              <div className="bg-card rounded-xl shadow-sm p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-lg">
                  {categoryIcons[exp.category] || "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{exp.description}</p>
                  <p className="text-xs text-muted-foreground">{exp.dateAdded}</p>
                </div>
                <p className="font-bold text-foreground text-sm whitespace-nowrap">
                  {currency.symbol}{exp.amount.toLocaleString()}
                </p>
                <button
                  onClick={() => setConfirmId(exp.id)}
                  className="text-muted-foreground/50 hover:text-destructive transition-colors text-sm ml-1"
                >
                  ✕
                </button>
              </div>

              {confirmId === exp.id && (
                <div className="flex items-center gap-2 mt-1 ml-12 animate-in fade-in duration-150">
                  <span className="text-xs text-muted-foreground">Remove this expense?</span>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(exp.id)}
                    className="h-6 text-xs bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full px-3"
                  >
                    Yes
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmId(null)}
                    className="h-6 text-xs rounded-full px-3"
                  >
                    No
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseLog;
