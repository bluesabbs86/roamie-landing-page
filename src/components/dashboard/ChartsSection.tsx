import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Currency } from "@/contexts/CurrencyContext";

interface Allocations {
  flights: { percent: number; amount: number };
  hotel: { percent: number; amount: number };
  activities: { percent: number; amount: number };
  food: { percent: number; amount: number };
}

interface SpentByCategory {
  flights: number;
  hotel: number;
  activities: number;
  food: number;
}

interface Props {
  allocations: Allocations;
  spentByCategory: SpentByCategory;
  totalBudget: number;
  currency: Currency;
}

const COLORS = ["#FF6B6B", "#FF8E53", "#FFC107", "#4CAF50"];
const CATEGORIES = ["Flights", "Hotel", "Activities", "Food"];
const KEYS: (keyof Allocations)[] = ["flights", "hotel", "activities", "food"];

const ChartsSection = ({ allocations, spentByCategory, totalBudget, currency }: Props) => {
  const [open, setOpen] = useState(false);

  const allocationData = KEYS.map((k, i) => ({
    name: CATEGORIES[i],
    value: allocations[k].amount,
    color: COLORS[i],
  }));

  const comparisonData = KEYS.map((k, i) => ({
    category: CATEGORIES[i],
    Allocated: allocations[k].amount,
    Spent: spentByCategory[k],
  }));

  return (
    <div>
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => setOpen(!open)}
          className="rounded-full border border-primary text-primary hover:bg-primary/10"
        >
          📊 {open ? "Hide Charts" : "View Charts"}
        </Button>
      </div>

      {open && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {/* Donut */}
          <div className="bg-card rounded-2xl shadow-md p-4">
            <h3 className="font-display font-bold text-sm text-foreground mb-2 text-center">Budget Allocation</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={allocationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {allocationData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${currency.symbol}${value.toLocaleString()}`}
                />
                <Legend
                  formatter={(value: string, entry: any) => {
                    const item = allocationData.find((d) => d.name === value);
                    return `${value}: ${currency.symbol}${item?.value.toLocaleString() || 0}`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar */}
          <div className="bg-card rounded-2xl shadow-md p-4">
            <h3 className="font-display font-bold text-sm text-foreground mb-2 text-center">Allocated vs Spent</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comparisonData}>
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number) => `${currency.symbol}${value.toLocaleString()}`}
                />
                <Legend />
                <Bar dataKey="Allocated" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#C0392B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartsSection;
