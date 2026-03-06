import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Signs the user out when they close/leave the site,
 * unless they have explicitly saved their current trip (flagged in sessionStorage).
 */
export function useAutoLogoff() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      const hasSaved = sessionStorage.getItem("roamie:session_saved");
      if (!hasSaved) {
        // Sign out and clear local auth data synchronously
        supabase.auth.signOut();
        localStorage.removeItem("sb-mpleigjbaouoykvoekyu-auth-token");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
}

/** Call this when the user explicitly saves a trip */
export function markSessionSaved() {
  sessionStorage.setItem("roamie:session_saved", "true");
}
