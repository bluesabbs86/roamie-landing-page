import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { currencies, Currency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TripData {
  totalBudget: number;
  allocations: {
    flights: { percent: number; amount: number };
    hotel: { percent: number; amount: number };
    activities: { percent: number; amount: number };
    food: { percent: number; amount: number };
  };
  [key: string]: any;
}

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  dateAdded: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCurrency: Currency;
  trip: TripData;
  expenses: Expense[];
  onConvert: (newCurrency: Currency, updatedTrip: TripData, updatedExpenses: Expense[]) => void;
}

const CurrencySwitcherModal = ({ open, onOpenChange, currentCurrency, trip, expenses, onConvert }: Props) => {
  const [converting, setConverting] = useState(false);

  const handleSelect = async (newCurrency: Currency) => {
    if (newCurrency.code === currentCurrency.code) {
      onOpenChange(false);
      return;
    }

    setConverting(true);
    try {
      const { data, error } = await supabase.functions.invoke("currency-convert", {
        body: {
          totalBudget: trip.totalBudget,
          fromCurrencyCode: currentCurrency.code,
        },
      });

      if (error) throw error;

      const rates = data as Record<string, number>;
      const newBudget = rates[newCurrency.code];
      if (!newBudget) throw new Error("Missing rate");

      const conversionRatio = newBudget / trip.totalBudget;

      const updatedTrip: TripData = {
        ...trip,
        totalBudget: +newBudget.toFixed(2),
        allocations: {
          flights: { ...trip.allocations.flights, amount: +(trip.allocations.flights.amount * conversionRatio).toFixed(2) },
          hotel: { ...trip.allocations.hotel, amount: +(trip.allocations.hotel.amount * conversionRatio).toFixed(2) },
          activities: { ...trip.allocations.activities, amount: +(trip.allocations.activities.amount * conversionRatio).toFixed(2) },
          food: { ...trip.allocations.food, amount: +(trip.allocations.food.amount * conversionRatio).toFixed(2) },
        },
      };

      const updatedExpenses = expenses.map((e) => ({
        ...e,
        amount: +(e.amount * conversionRatio).toFixed(2),
      }));

      onConvert(newCurrency, updatedTrip, updatedExpenses);
      toast({ title: `Switched to ${newCurrency.flag} ${newCurrency.code}! 💱` });
      onOpenChange(false);
    } catch (e) {
      console.error("Currency conversion error:", e);
      toast({ title: "Conversion failed — please try again", variant: "destructive" });
    } finally {
      setConverting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Switch Currency 💱</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            All amounts will be converted automatically
          </DialogDescription>
        </DialogHeader>

        {converting ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Converting your budget... 💱</p>
          </div>
        ) : (
          <div className="space-y-2">
            {currencies.map((c) => {
              const isActive = c.code === currentCurrency.code;
              return (
                <button
                  key={c.code}
                  onClick={() => handleSelect(c)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground border-transparent"
                      : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <span className="font-bold">{c.code}</span>
                  <span className={`text-sm ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <p className="text-xs text-muted-foreground italic text-center">Rates are approximate</p>
      </DialogContent>
    </Dialog>
  );
};

export default CurrencySwitcherModal;
