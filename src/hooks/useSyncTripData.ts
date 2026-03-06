import { useEffect, useCallback } from "react";

/**
 * Re-reads trip data from localStorage whenever the page gains focus
 * (e.g. user navigated back from planner). Calls the setter callbacks
 * with fresh data so the page always reflects the latest state.
 */
export function useSyncTripData(setters: {
  setTrip: (t: any) => void;
  setCurrency: (c: any) => void;
  setExpenses?: (e: any[]) => void;
  setItinerary?: (i: Record<string, string[]>) => void;
  setRecommendations?: (r: any[]) => void;
}) {
  const sync = useCallback(() => {
    try {
      const t = localStorage.getItem("roamie:trip");
      if (t) setters.setTrip(JSON.parse(t));
      else setters.setTrip(null);
    } catch {}
    try {
      const c = localStorage.getItem("roamie:currency");
      if (c) setters.setCurrency(JSON.parse(c));
    } catch {}
    if (setters.setExpenses) {
      try {
        const e = localStorage.getItem("roamie:expenses");
        setters.setExpenses(e ? JSON.parse(e) : []);
      } catch {}
    }
    if (setters.setItinerary) {
      try {
        const it = localStorage.getItem("roamie:itinerary");
        setters.setItinerary(it ? JSON.parse(it) : {});
      } catch {}
    }
    if (setters.setRecommendations) {
      try {
        const r = localStorage.getItem("roamie:recommendations");
        const parsed = r ? JSON.parse(r) : [];
        setters.setRecommendations(Array.isArray(parsed) ? parsed : []);
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load on mount
  useEffect(() => {
    sync();
  }, [sync]);

  // Re-sync when page becomes visible (user navigated back)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") sync();
    };
    const handleFocus = () => sync();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    // Also listen for popstate (back/forward navigation)
    window.addEventListener("popstate", sync);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("popstate", sync);
    };
  }, [sync]);
}
