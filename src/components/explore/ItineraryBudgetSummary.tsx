import { Currency } from "@/contexts/CurrencyContext";
import { Progress } from "@/components/ui/progress";

interface ItineraryBudgetSummaryProps {
  activitiesAllocated: number;
  totalPlannedCost: number;
  currency: Currency;
}

const ItineraryBudgetSummary = ({ activitiesAllocated, totalPlannedCost, currency }: ItineraryBudgetSummaryProps) => {
  const budgetAfterPlan = activitiesAllocated - totalPlannedCost;
  const percent = activitiesAllocated > 0 ? (totalPlannedCost / activitiesAllocated) * 100 : 0;

  const budgetColor = budgetAfterPlan > 0 ? "text-green-600" : "text-red-500";
  const nudge =
    percent < 80
      ? "Great planning! You've got budget to spare. 🎉"
      : percent <= 100
      ? "Almost fully planned — a little wiggle room left. 🤔"
      : "You've planned more than your activities budget — swap a splurge for a free option! 😅";

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
      <h2 className="font-display text-lg font-bold text-foreground mb-4">📊 Itinerary Budget Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">🎯 Activities Allocated</p>
          <p className="text-lg font-bold text-foreground">{currency.symbol}{activitiesAllocated.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">💸 Total Planned</p>
          <p className="text-lg font-bold text-foreground">{currency.symbol}{totalPlannedCost.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">🏦 Budget After Plan</p>
          <p className={`text-lg font-bold ${budgetColor}`}>{currency.symbol}{budgetAfterPlan.toFixed(0)}</p>
        </div>
      </div>

      <Progress value={Math.min(percent, 100)} className="h-3 mb-1" />
      <p className="text-xs text-primary font-semibold mb-3">{percent.toFixed(0)}% of activities budget planned</p>

      <div className="bg-accent/50 rounded-xl p-3 border-l-4 border-l-primary">
        <p className="text-sm text-foreground">{nudge}</p>
        <p className="text-xs text-primary italic mt-1">— Roamie 🧡</p>
      </div>
    </div>
  );
};

export default ItineraryBudgetSummary;
