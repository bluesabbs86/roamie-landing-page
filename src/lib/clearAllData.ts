import { toast } from "@/hooks/use-toast";

export function clearAllRoamieData(navigate: (path: string) => void) {
  if (!window.confirm("Clear all trip data and start over?")) return;
  localStorage.removeItem("roamie:trip");
  localStorage.removeItem("roamie:currency");
  localStorage.removeItem("roamie:expenses");
  localStorage.removeItem("roamie:itinerary");
  localStorage.removeItem("roamie:recommendations");
  toast({ title: "All data cleared! Starting fresh 🧹" });
  navigate("/plan");
}
