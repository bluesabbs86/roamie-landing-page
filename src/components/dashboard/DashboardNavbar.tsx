import { useNavigate } from "react-router-dom";
import { Currency } from "@/contexts/CurrencyContext";
import { clearAllRoamieData } from "@/lib/clearAllData";

interface Props {
  currency: Currency;
  feasibility?: string;
  onCurrencyChange: () => void;
}

const DashboardNavbar = ({ currency, feasibility, onCurrencyChange }: Props) => {
  const navigate = useNavigate();

  const feasibilityConfig: Record<string, { bg: string; text: string; label: string }> = {
    comfortable: { bg: "bg-green-500", text: "text-white", label: "✅ Comfortable" },
    tight: { bg: "bg-amber-400", text: "text-foreground", label: "⚠️ Tight" },
    "over-budget": { bg: "bg-destructive", text: "text-white", label: "❌ Over Budget" },
  };

  const badge = feasibility ? feasibilityConfig[feasibility] : null;

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 md:px-8">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-1.5">
          <span className="font-display text-xl font-bold text-primary">Roamie</span>
          <span className="text-lg">🧡</span>
        </div>

        <span className="hidden md:block font-display font-bold text-foreground">Budget Dashboard</span>

        <div className="flex items-center gap-2">
          <button
            onClick={onCurrencyChange}
            className="flex items-center gap-1 text-sm bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors"
          >
            {currency.flag} {currency.code}
            <span className="text-xs text-muted-foreground ml-1">💱</span>
          </button>

          {badge && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          )}

          <button
            onClick={() => navigate("/plan")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => clearAllRoamieData(navigate)}
            className="text-sm text-destructive hover:text-destructive/80 transition-colors"
          >
            🗑️ Reset
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
