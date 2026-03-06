import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * When a saved itinerary is loaded (tracked via roamie:active_itinerary_id),
 * this hook auto-saves localStorage changes back to the database on a debounce.
 */
export function useAutoSaveTrip(dependencies: any[]) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const activeId = localStorage.getItem("roamie:active_itinerary_id");
    if (!activeId) return;

    // Debounce saves by 2 seconds
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const tripData = JSON.parse(localStorage.getItem("roamie:trip") || "null");
        if (!tripData) return;

        const currency = JSON.parse(localStorage.getItem("roamie:currency") || "null");
        const itinerary = JSON.parse(localStorage.getItem("roamie:itinerary") || "{}");
        const recommendations = JSON.parse(localStorage.getItem("roamie:recommendations") || "[]");
        const expenses = JSON.parse(localStorage.getItem("roamie:expenses") || "[]");

        await supabase
          .from("saved_itineraries")
          .update({
            trip_data: { ...tripData, currency },
            allocations: tripData.allocations,
            itinerary,
            recommendations,
            expenses,
            updated_at: new Date().toISOString(),
          })
          .eq("id", activeId);
      } catch (e) {
        console.error("Auto-save failed:", e);
      }
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
