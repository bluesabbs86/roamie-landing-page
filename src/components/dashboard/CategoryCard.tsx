import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Currency } from "@/contexts/CurrencyContext";
import { toast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  dateAdded: string;
}

interface Props {
  categoryKey: string;
  icon: string;
  name: string;
  allocated: number;
  spent: number;
  currency: Currency;
  onAddExpense: (expense: Expense) => void;
}

const CategoryCard = ({ categoryKey, icon, name, allocated, spent, currency, onAddExpense }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [formError, setFormError] = useState("");

  const remaining = allocated - spent;
  const percentUsed = allocated > 0 ? (spent / allocated) * 100 : 0;

  const barColor =
    percentUsed < 70 ? "bg-green-500" : percentUsed < 90 ? "bg-amber-400" : "bg-destructive";

  const dotColor =
    percentUsed < 70 ? "bg-green-500" : percentUsed < 90 ? "bg-amber-400" : "bg-destructive";

  const remainingColor =
    remaining >= 0 ? (percentUsed < 70 ? "text-green-600" : percentUsed < 90 ? "text-amber-500" : "text-destructive") : "text-destructive";

  const handleAdd = () => {
    if (!description.trim() || !amount || parseFloat(amount) <= 0) {
      setFormError("Please fill in both fields 🙏");
      return;
    }
    setFormError("");
    const newExpense: Expense = {
      id: `exp_${Date.now()}`,
      category: categoryKey,
      description: description.trim(),
      amount: parseFloat(amount),
      dateAdded: date,
    };
    onAddExpense(newExpense);
    setDescription("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setShowForm(false);
    toast({ title: "Expense added! 💸" });
  };

  return (
    <div className="bg-card rounded-2xl shadow-md p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="font-display font-bold text-foreground">{name}</span>
        </div>
        <div className={`w-3 h-3 rounded-full ${dotColor}`} />
      </div>

      {/* Figures */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
        <div>
          <p className="text-muted-foreground">Allocated</p>
          <p className="font-medium text-muted-foreground">{currency.symbol}{allocated.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Spent</p>
          <p className="font-bold text-foreground">{currency.symbol}{spent.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Remaining</p>
          <p className={`font-bold ${remainingColor}`}>{currency.symbol}{remaining.toLocaleString()}</p>
        </div>
      </div>

      {/* Mini progress */}
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      {/* Add button / form */}
      {!showForm ? (
        <Button
          variant="outline"
          onClick={() => setShowForm(true)}
          className="w-full rounded-full border-primary text-primary hover:bg-primary/10 text-sm"
        >
          + Add Expense
        </Button>
      ) : (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
          <Input
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl text-sm"
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {currency.symbol}
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-xl pl-8 text-sm"
              />
            </div>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl text-sm w-[130px]"
            />
          </div>
          {formError && <p className="text-xs text-destructive">{formError}</p>}
          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full text-sm"
            >
              ✓ Add
            </Button>
            <Button
              variant="ghost"
              onClick={() => { setShowForm(false); setFormError(""); }}
              className="flex-1 rounded-full text-sm"
            >
              ✗ Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
