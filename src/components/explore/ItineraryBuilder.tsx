import { useState } from "react";
import { Currency } from "@/contexts/CurrencyContext";
import { toast } from "@/hooks/use-toast";
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
  onRemoveFromDay: (activityId: string, day: number) => void;
  onReorder: (dayKey: string, newOrder: string[]) => void;
}

const ItineraryBuilder = ({
  nights,
  checkIn,
  currency,
  itinerary,
  recommendations,
  adults,
  children,
  onRemoveFromDay,
  onReorder,
}: ItineraryBuilderProps) => {
  const [activeDay, setActiveDay] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
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

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-foreground mb-4">
        📅 Your {recommendations.length > 0 ? "Itinerary" : "Trip"} Planner
      </h2>

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
            <p className="text-sm text-muted-foreground">Add activities using the buttons above!</p>
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
