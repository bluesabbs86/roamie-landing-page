import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  details: string;
  priority: "essential" | "recommended" | "optional";
  dueBeforeTrip: string;
  checked?: boolean;
}

interface Props {
  itinerary: {
    id: string;
    trip_data: any;
    checklist: any[];
  };
  nationality: string;
  onChecklistUpdate: (checklist: ChecklistItem[]) => void;
}

const categoryIcons: Record<string, string> = {
  Documents: "📄",
  Health: "💊",
  Money: "💰",
  Packing: "🧳",
  Bookings: "🎫",
  Tech: "📱",
  Safety: "🛡️",
};

const priorityColors: Record<string, string> = {
  essential: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  recommended: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  optional: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const TripChecklist = ({ itinerary, nationality, onChecklistUpdate }: Props) => {
  const [loading, setLoading] = useState(false);
  const checklist: ChecklistItem[] = itinerary.checklist || [];
  const hasChecklist = checklist.length > 0;

  const generateChecklist = async () => {
    setLoading(true);
    try {
      const trip = itinerary.trip_data;
      const { data, error } = await supabase.functions.invoke("trip-checklist", {
        body: {
          destination: trip.destination,
          departure: trip.departure,
          checkIn: trip.checkIn,
          checkOut: trip.checkOut,
          nights: trip.nights,
          adults: trip.adults,
          children: trip.children,
          nationality: nationality,
          currencyCode: trip.currency?.code || "USD",
        },
      });

      if (error) throw error;
      if (!Array.isArray(data)) throw new Error("Invalid response");

      const items = data.map((item: any) => ({ ...item, checked: false }));
      onChecklistUpdate(items);
      toast({ title: "Checklist generated! ✅" });
    } catch (e: any) {
      console.error("Checklist error:", e);
      toast({ title: e.message || "Failed to generate checklist", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (itemId: string) => {
    const updated = checklist.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    onChecklistUpdate(updated);
  };

  const completedCount = checklist.filter((i) => i.checked).length;

  // Group by category
  const categories = checklist.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (!hasChecklist) {
    return (
      <div className="bg-muted/30 rounded-xl p-4 text-center">
        <p className="font-display font-bold text-foreground mb-1">📋 Trip Preparation Checklist</p>
        <p className="text-sm text-muted-foreground mb-3">
          Get AI-powered passport, visa, and travel prep recommendations
        </p>
        <Button
          onClick={generateChecklist}
          disabled={loading}
          className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Generating...
            </>
          ) : (
            "Generate My Checklist 🧡"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-foreground">📋 Trip Checklist</h3>
        <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground font-semibold">
          {completedCount}/{checklist.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
          style={{ width: `${checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0}%` }}
        />
      </div>

      {Object.entries(categories).map(([cat, items]) => (
        <div key={cat} className="bg-muted/30 rounded-xl p-3">
          <h4 className="font-semibold text-foreground text-sm mb-2">
            {categoryIcons[cat] || "📌"} {cat}
          </h4>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-2 p-2 rounded-lg transition-colors ${
                  item.checked ? "opacity-60" : ""
                }`}
              >
                <Checkbox
                  checked={item.checked || false}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-medium ${item.checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.item}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${priorityColors[item.priority] || ""}`}>
                      {item.priority}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      ⏰ {item.dueBeforeTrip}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={generateChecklist}
        disabled={loading}
        className="rounded-full w-full"
      >
        {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : "🔄"} Regenerate Checklist
      </Button>
    </div>
  );
};

export default TripChecklist;
