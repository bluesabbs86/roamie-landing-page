import { useNavigate } from "react-router-dom";
import { useCurrency, currencies } from "@/contexts/CurrencyContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clearAllRoamieData } from "@/lib/clearAllData";

const PlannerNavbar = () => {
  const navigate = useNavigate();
  const { selectedCurrency, setSelectedCurrency } = useCurrency();

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="font-display text-xl font-bold text-primary">Roamie</span>
        <span className="text-lg">🧡</span>
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={selectedCurrency.code}
          onValueChange={(code) => {
            const c = currencies.find((c) => c.code === code);
            if (c) setSelectedCurrency(c);
          }}
        >
          <SelectTrigger className="w-[130px] rounded-xl border-border">
            <SelectValue>
              {selectedCurrency.flag} {selectedCurrency.code}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {currencies.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          onClick={() => clearAllRoamieData(navigate)}
          className="text-sm text-destructive hover:text-destructive/80 transition-colors"
        >
          🗑️ Reset
        </button>
      </div>
    </nav>
  );
};

export default PlannerNavbar;
