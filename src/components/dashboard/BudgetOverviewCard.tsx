import { Currency } from "@/contexts/CurrencyContext";

interface Props {
  totalBudget: number;
  totalSpent: number;
  currency: Currency;
}

const BudgetOverviewCard = ({ totalBudget, totalSpent, currency }: Props) => {
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const percentRemaining = totalBudget > 0 ? (remaining / totalBudget) * 100 : 100;

  const remainingColor =
    percentRemaining > 30 ? "text-green-600" : percentRemaining > 10 ? "text-amber-500" : "text-destructive";

  const pulseClass = percentRemaining <= 30 ? "animate-pulse" : "";

  const statusMessage =
    percentRemaining > 30
      ? "You're cruising! Plenty of budget left. 🎉"
      : percentRemaining > 10
      ? "Getting close — choose your next spend wisely. 🤔"
      : "You've hit your limit. Time to get creative! 😅";

  return (
    <div className="bg-card rounded-2xl shadow-md p-5 md:p-6">
      {/* Stat blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="text-center sm:text-left">
          <p className="text-xs text-muted-foreground">💰 Total Budget</p>
          <p className="text-xl font-display font-bold text-foreground">
            {currency.symbol}{totalBudget.toLocaleString()}
          </p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-xs text-muted-foreground">💸 Spent So Far</p>
          <p className="text-xl font-display font-bold text-foreground">
            {currency.symbol}{totalSpent.toLocaleString()}
          </p>
        </div>
        <div className={`text-center sm:text-left ${pulseClass}`}>
          <p className="text-xs text-muted-foreground">🏦 Remaining</p>
          <p className={`text-xl font-display font-bold ${remainingColor}`}>
            {currency.symbol}{remaining.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="border-t border-border my-4" />

      {/* Progress bar */}
      <div className="relative mb-2">
        <div className="w-full h-4 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-400"
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
        <span
          className="absolute -top-5 text-xs font-bold text-primary transition-all duration-400"
          style={{ left: `${Math.min(percentUsed, 95)}%` }}
        >
          {percentUsed.toFixed(0)}% used
        </span>
      </div>

      {/* Status message */}
      <div className="mt-4 bg-accent border-l-4 border-primary rounded-xl p-3">
        <p className="text-sm text-foreground">{statusMessage}</p>
        <p className="text-xs text-muted-foreground italic mt-1">— Roamie 🧡</p>
      </div>
    </div>
  );
};

export default BudgetOverviewCard;
