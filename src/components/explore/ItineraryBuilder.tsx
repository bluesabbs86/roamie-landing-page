import { useState } from "react";
import { Currency } from "@/contexts/CurrencyContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableActivity from "./SortableActivity";

interface Activity {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  estimatedCostPerPerson: number;
  duration: string;
}

interface ItineraryBuilderProps {
  nights: number;
  checkIn: string;
  currency: Currency;
  itinerary: Record<string, string[]>;
  recommendations: Activity[];
  adults: number;
  children: number;
  destination: string;
  onRemoveFromDay: (activityId: string, day: number) => void;
  onReorder: (dayKey: string, newOrder: string[]) => void;
  onAddCustomActivity: (activity: Activity, day: number) => void;
}

interface AiSuggestion {
  name: string;
  estimatedCostPerPerson: number;
  duration: string;
  category: string;
  categoryIcon: string;
}

const ItineraryBuilder = ({
  nights,
  checkIn,
  currency,
  itinerary,
  recommendations,
  adults,
  children,
  destination,
  onRemoveFromDay,
  onReorder,
  onAddCustomActivity,
}: ItineraryBuilderProps) => {
  const [activeDay, setActiveDay] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [customPrice, setCustomPrice] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
  const totalPeople = adults + (children || 0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const getDayDate = (dayNum: number) => {
    if (!checkIn) return "";
    const d = new Date(checkIn);
    d.setDate(d.getDate() + dayNum - 1);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  const dayKey = `day${activeDay}`;
  const dayActivityIds = itinerary[dayKey] || [];
  const dayActivities = dayActivityIds
    .map((id) => recommendations.find((r) => r.id === id))
    .filter(Boolean) as Activity[];

  const dayTotal = dayActivities.reduce((s, a) => s + a.estimatedCostPerPerson * totalPeople, 0);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = dayActivityIds.indexOf(active.id as string);
    const newIndex = dayActivityIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(dayActivityIds, oldIndex, newIndex);
    onReorder(dayKey, newOrder);
  };

  const handleAddManual = () => {
    if (!activityName.trim()) {
      toast({ title: "Enter an activity name", variant: "destructive" });
      return;
    }
    const cost = isFree ? 0 : parseFloat(customPrice) || 0;
    const activity: Activity = {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: activityName.trim(),
      category: "Custom",
      categoryIcon: "📌",
      estimatedCostPerPerson: cost,
      duration: "Flexible",
    };
    onAddCustomActivity(activity, activeDay);
    setActivityName("");
    setCustomPrice("");
    setIsFree(true);
    setShowAddForm(false);
    toast({ title: `Added "${activity.name}" to Day ${activeDay}! 🎯` });
  };

  const handleAiSuggest = async () => {
    setAiLoading(true);
    setAiSuggestions([]);
    try {
      const { data, error } = await supabase.functions.invoke("activity-autofill", {
        body: { destination, currencyCode: currency.code },
      });
      if (error) throw error;
      if (Array.isArray(data)) {
        setAiSuggestions(data);
      }
    } catch (e) {
      console.error("AI autofill error:", e);
      toast({ title: "Couldn't get AI suggestions right now", variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const handlePickSuggestion = (s: AiSuggestion) => {
    const activity: Activity = {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: s.name,
      category: s.category,
      categoryIcon: s.categoryIcon,
      estimatedCostPerPerson: s.estimatedCostPerPerson,
      duration: s.duration,
    };
    onAddCustomActivity(activity, activeDay);
    setAiSuggestions([]);
    setShowAddForm(false);
    toast({ title: `Added "${activity.name}" to Day ${activeDay}! 🎯` });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          📅 Your {recommendations.length > 0 ? "Itinerary" : "Trip"} Planner
        </h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-full text-xs gap-1"
        >
          <Plus className="h-3.5 w-3.5" /> Add Activity
        </Button>
      </div>

      {/* Manual Add Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <p className="font-display font-bold text-sm text-foreground">Add to Day {activeDay}</p>
            <button
              onClick={handleAiSuggest}
              disabled={aiLoading}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
              title="Get AI suggestions"
            >
              <Sparkles className={`h-4 w-4 ${aiLoading ? "animate-spin" : ""}`} />
              {aiLoading ? "Thinking..." : "AI Suggest"}
            </button>
          </div>

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Pick a suggestion:</p>
              {aiSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handlePickSuggestion(s)}
                  className="w-full text-left bg-accent/50 hover:bg-accent border border-border rounded-xl p-3 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">
                      {s.categoryIcon} {s.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {s.estimatedCostPerPerson === 0
                        ? "Free"
                        : `${currency.symbol}${s.estimatedCostPerPerson}/pp`}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.duration}</p>
                </button>
              ))}
            </div>
          )}

          <Input
            placeholder="Activity name"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            className="rounded-xl"
          />

          <div className="flex items-center gap-3">
            <select
              value={isFree ? "free" : "paid"}
              onChange={(e) => setIsFree(e.target.value === "free")}
              className="rounded-xl border border-input bg-background px-3 py-2 text-sm h-10"
            >
              <option value="free">🆓 Free</option>
              <option value="paid">💰 Custom Price</option>
            </select>
            {!isFree && (
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder={`Price per person (${currency.code})`}
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="rounded-xl flex-1"
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAddManual}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full text-sm"
            >
              Add to Day {activeDay}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddForm(false);
                setAiSuggestions([]);
              }}
              className="rounded-full text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
        {Array.from({ length: nights }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs transition-all ${
              activeDay === day
                ? "border-b-2 border-primary text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground bg-muted"
            }`}
          >
            <div className="font-bold">Day {day}</div>
            <div className="text-[9px] opacity-70">{getDayDate(day)}</div>
          </button>
        ))}
      </div>

      {/* Day panel */}
      <div className="min-h-[120px]">
        {dayActivities.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl">🎒</span>
            <p className="font-display font-bold text-foreground mt-2">Nothing planned for Day {activeDay} yet</p>
            <p className="text-sm text-muted-foreground">Add activities using the button above!</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={dayActivityIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {dayActivities.map((act) => (
                  <SortableActivity
                    key={act.id}
                    activity={act}
                    currency={currency}
                    totalPeople={totalPeople}
                    activeDay={activeDay}
                    confirmDelete={confirmDelete}
                    onConfirmDelete={setConfirmDelete}
                    onRemove={(id, day) => {
                      onRemoveFromDay(id, day);
                      toast({ title: `Removed from Day ${day} 🗑️`, variant: "destructive" });
                    }}
                  />
                ))}

                {/* Day summary */}
                <div className="flex justify-between items-center pt-2 text-sm">
                  <span className="font-bold text-primary">
                    Day {activeDay} total: {currency.symbol}{dayTotal.toFixed(0)}
                  </span>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default ItineraryBuilder;
