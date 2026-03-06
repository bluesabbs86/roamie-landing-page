import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Currency } from "@/contexts/CurrencyContext";
import { GripVertical } from "lucide-react";

interface Activity {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  estimatedCostPerPerson: number;
  duration: string;
}

interface SortableActivityProps {
  activity: Activity;
  currency: Currency;
  totalPeople: number;
  activeDay: number;
  confirmDelete: string | null;
  onConfirmDelete: (id: string | null) => void;
  onRemove: (id: string, day: number) => void;
}

const SortableActivity = ({
  activity,
  currency,
  totalPeople,
  activeDay,
  confirmDelete,
  onConfirmDelete,
  onRemove,
}: SortableActivityProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card rounded-xl shadow-sm border border-border p-3 flex items-center gap-2"
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1 -ml-1 flex-shrink-0"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <span className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-sm flex-shrink-0">
        {activity.categoryIcon}
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm truncate">{activity.name}</p>
        <p className="text-xs text-muted-foreground">
          {activity.category} · {activity.duration}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-primary">
          {activity.estimatedCostPerPerson === 0
            ? "Free"
            : `${currency.symbol}${(activity.estimatedCostPerPerson * totalPeople).toFixed(0)}`}
        </p>
        {confirmDelete === activity.id ? (
          <div className="flex gap-1 mt-1">
            <button
              onClick={() => {
                onRemove(activity.id, activeDay);
                onConfirmDelete(null);
              }}
              className="text-[10px] text-red-500 font-semibold"
            >
              Yes
            </button>
            <button onClick={() => onConfirmDelete(null)} className="text-[10px] text-muted-foreground">
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => onConfirmDelete(activity.id)}
            className="text-xs text-muted-foreground hover:text-red-500 mt-1"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SortableActivity;
