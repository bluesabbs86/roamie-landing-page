import { Currency } from "@/contexts/CurrencyContext";

interface ExploreHeaderProps {
  destination: string;
  activitiesRemaining: number;
  totalRemaining: number;
  totalPlannedCost: number;
  currency: Currency;
}

const ExploreHeader = ({ destination, activitiesRemaining, totalRemaining, totalPlannedCost, currency }: ExploreHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary px-4 py-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
            What to do in {destination} 🎯
          </h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Personalised for your remaining budget
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {activitiesRemaining > 0 ? (
            <span className="px-3 py-1.5 rounded-full bg-white/20 text-primary-foreground text-sm font-semibold">
              🎯 Activities: {currency.symbol}{activitiesRemaining.toFixed(0)}
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-sm font-semibold">
              🎯 Activities budget used up
            </span>
          )}
          {totalPlannedCost > 0 && (
            <span className="px-3 py-1.5 rounded-full bg-white/20 text-primary-foreground text-sm font-semibold">
              📋 Planned: {currency.symbol}{totalPlannedCost.toFixed(0)}
            </span>
          )}
          <span className="px-3 py-1.5 rounded-full bg-white/20 text-primary-foreground text-sm font-semibold">
            💰 Remaining: {currency.symbol}{totalRemaining.toFixed(0)}
          </span>
        </div>
      </div>
      {activitiesRemaining <= 0 && (
        <div className="max-w-5xl mx-auto mt-3">
          <div className="bg-accent text-accent-foreground px-4 py-2 rounded-xl text-sm">
            Your activities budget is spent — but great free options still await! 🆓
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreHeader;
