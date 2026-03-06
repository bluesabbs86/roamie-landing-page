import { useNavigate } from "react-router-dom";
import { Currency } from "@/contexts/CurrencyContext";

interface ExploreNavbarProps {
  destination: string;
  activitiesRemaining: number;
  totalRemaining: number;
  totalBudget: number;
  currency: Currency;
}

const ExploreNavbar = ({ destination, activitiesRemaining, totalRemaining, totalBudget, currency }: ExploreNavbarProps) => {
  const navigate = useNavigate();

  const remainingPercent = (totalRemaining / totalBudget) * 100;
  const remainingColor = remainingPercent > 30 ? "text-green-600" : remainingPercent > 10 ? "text-amber-500" : "text-red-500";

  return (
    <nav className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-primary">Roamie</span>
          <span>🧡</span>
        </div>

        <span className="hidden md:block font-display font-bold text-foreground">
          Explore {destination}
        </span>

        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded-full bg-muted font-semibold ${activitiesRemaining > 0 ? "text-green-600" : "text-red-500"}`}>
            🎯 {currency.symbol}{activitiesRemaining.toFixed(0)}
          </span>
          <span className={`px-2 py-1 rounded-full bg-muted font-semibold ${remainingColor}`}>
            💰 {currency.symbol}{totalRemaining.toFixed(0)}
          </span>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ExploreNavbar;
