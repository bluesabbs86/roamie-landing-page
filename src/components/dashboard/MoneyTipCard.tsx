import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  destination: string;
  totalBudget: number;
  currencySymbol: string;
  currencyCode: string;
  nights: number;
  adults: number;
  children: number;
  allocations: any;
}

const MoneyTipCard = ({ destination, totalBudget, currencySymbol, currencyCode, nights, adults, children, allocations }: Props) => {
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTip = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("money-tip", {
        body: { destination, totalBudget, currencySymbol, currencyCode, nights, adults, children, allocations },
      });
      if (fnError) throw fnError;
      setTip(data.tip || "Save money by exploring local food markets!");
    } catch (e) {
      console.error("Money tip error:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [destination, totalBudget, currencyCode]);

  useEffect(() => { fetchTip(); }, []);

  return (
    <div className="bg-card rounded-2xl shadow-md p-5 border-l-4 border-primary">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <h3 className="font-display font-bold text-foreground text-sm">Roamie's Money Tip</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchTip}
          className="text-xs text-primary hover:text-primary/80 rounded-full"
          disabled={loading}
        >
          Get new tip 🔄
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-12 w-full rounded-xl" />
      ) : error ? (
        <p className="text-sm text-muted-foreground italic">
          Roamie couldn't fetch a tip right now — tap to try again! 🔄
        </p>
      ) : (
        <p className="text-sm text-muted-foreground italic">{tip}</p>
      )}
      <p className="text-xs text-primary italic mt-2">— Roamie 🧡</p>
    </div>
  );
};

export default MoneyTipCard;
