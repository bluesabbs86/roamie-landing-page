import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { exportTripPdf } from "@/lib/exportPdf";
import BottomNav from "@/components/dashboard/BottomNav";
import TripChecklist from "@/components/account/TripChecklist";
import { LogOut, Trash2, Download, MapPin, Plus } from "lucide-react";

interface SavedItinerary {
  id: string;
  name: string;
  trip_data: any;
  allocations: any;
  itinerary: any;
  recommendations: any;
  expenses: any;
  checklist: any[];
  created_at: string;
  updated_at: string;
}

interface Profile {
  full_name: string;
  nationality: string;
}

const Account = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editNationality, setEditNationality] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, nationality")
        .eq("id", user!.id)
        .single();
      if (profileData) {
        setProfile(profileData);
        setEditName(profileData.full_name);
        setEditNationality(profileData.nationality);
      }

      // Load itineraries
      const { data: trips } = await supabase
        .from("saved_itineraries")
        .select("*")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });
      if (trips) setItineraries(trips as unknown as SavedItinerary[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: editName, nationality: editNationality })
      .eq("id", user.id);
    if (error) {
      toast({ title: "Failed to update profile", variant: "destructive" });
    } else {
      setProfile({ full_name: editName, nationality: editNationality });
      setEditingProfile(false);
      toast({ title: "Profile updated! 🧡" });
    }
  };

  const saveCurrentTrip = async () => {
    if (!user) return;
    try {
      const tripData = JSON.parse(localStorage.getItem("roamie:trip") || "null");
      if (!tripData) {
        toast({ title: "No active trip to save. Plan one first!", variant: "destructive" });
        return;
      }

      const currency = JSON.parse(localStorage.getItem("roamie:currency") || "null");
      const itinerary = JSON.parse(localStorage.getItem("roamie:itinerary") || "{}");
      const recommendations = JSON.parse(localStorage.getItem("roamie:recommendations") || "[]");
      const expenses = JSON.parse(localStorage.getItem("roamie:expenses") || "[]");

      // Check for existing trip with same destination to upsert
      const tripName = `${tripData.destination} Trip`;
      const existing = itineraries.find((i) => i.name === tripName);

      if (existing) {
        const { error } = await supabase
          .from("saved_itineraries")
          .update({
            trip_data: { ...tripData, currency },
            allocations: tripData.allocations,
            itinerary,
            recommendations,
            expenses,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        if (error) throw error;
        toast({ title: "Trip updated! 🧡" });
      } else {
        if (itineraries.length >= 5) {
          toast({ title: "Maximum 5 saved trips. Delete one to save a new one.", variant: "destructive" });
          return;
        }
        const { error } = await supabase.from("saved_itineraries").insert({
          user_id: user.id,
          name: tripName,
          trip_data: { ...tripData, currency },
          allocations: tripData.allocations,
          itinerary,
          recommendations,
          expenses,
          checklist: [],
        });
        if (error) throw error;
        toast({ title: "Trip saved to your account! 🎉" });
      }
      loadData();
    } catch (e: any) {
      toast({ title: e.message || "Failed to save trip", variant: "destructive" });
    }
  };

  const deleteItinerary = async (id: string) => {
    const { error } = await supabase.from("saved_itineraries").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
    } else {
      setItineraries((prev) => prev.filter((i) => i.id !== id));
      toast({ title: "Trip removed" });
    }
  };

  const updateChecklist = async (itineraryId: string, checklist: any[]) => {
    await supabase
      .from("saved_itineraries")
      .update({ checklist, updated_at: new Date().toISOString() })
      .eq("id", itineraryId);
    setItineraries((prev) =>
      prev.map((i) => (i.id === itineraryId ? { ...i, checklist } : i))
    );
  };

  const handleExportPdf = (it: SavedItinerary) => {
    const trip = it.trip_data;
    const currency = trip.currency || { symbol: "$", code: "USD", name: "US Dollar" };
    exportTripPdf({
      trip: {
        ...trip,
        allocations: it.allocations || trip.allocations,
      },
      currency,
      expenses: it.expenses || [],
      itinerary: it.itinerary || {},
      recommendations: (it.recommendations || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        estimatedCostPerPerson: r.estimatedCostPerPerson,
        duration: r.duration,
        mapsQuery: r.mapsQuery,
        category: r.category,
      })),
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-xl font-bold text-primary">Roamie</span>
            <span className="text-lg">🧡</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/plan")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ✈️ Plan Trip
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 text-sm text-destructive hover:text-destructive/80"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground">👤 My Profile</h2>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="text-sm text-primary hover:underline"
            >
              {editingProfile ? "Cancel" : "Edit"}
            </button>
          </div>
          {editingProfile ? (
            <div className="space-y-3">
              <Input className="rounded-xl" placeholder="Full Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              <Input className="rounded-xl" placeholder="Nationality" value={editNationality} onChange={(e) => setEditNationality(e.target.value)} />
              <Button onClick={updateProfile} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full">
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="text-sm space-y-1">
              <p className="text-foreground"><strong>Name:</strong> {profile?.full_name || "Not set"}</p>
              <p className="text-foreground"><strong>Nationality:</strong> {profile?.nationality || "Not set"}</p>
              <p className="text-muted-foreground"><strong>Email:</strong> {user?.email}</p>
            </div>
          )}
        </div>

        {/* Save Current Trip */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-5 text-center">
          <h3 className="font-display text-lg font-bold text-primary-foreground mb-1">
            Save Your Current Trip 💾
          </h3>
          <p className="text-primary-foreground/80 text-sm mb-3">
            {itineraries.length}/5 trips saved
          </p>
          <Button
            onClick={saveCurrentTrip}
            disabled={itineraries.length >= 5}
            className="bg-white text-primary hover:bg-white/90 rounded-full font-bold px-6"
          >
            <Plus className="h-4 w-4 mr-1" /> Save Current Trip
          </Button>
        </div>

        {/* Saved Itineraries */}
        <div>
          <h2 className="font-display text-lg font-bold text-foreground mb-3">🗺️ My Saved Trips ({itineraries.length}/5)</h2>
          {itineraries.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-8 text-center">
              <span className="text-4xl">✈️</span>
              <p className="text-muted-foreground mt-2">No saved trips yet. Plan a trip and save it here!</p>
              <Button onClick={() => navigate("/plan")} className="mt-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full">
                Start Planning →
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {itineraries.map((it) => {
                const trip = it.trip_data;
                const isExpanded = expandedTrip === it.id;
                return (
                  <div key={it.id} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                    {/* Trip Header */}
                    <button
                      onClick={() => setExpandedTrip(isExpanded ? null : it.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-foreground">{it.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {trip.checkIn} → {trip.checkOut} · {trip.nights} nights
                          </p>
                        </div>
                      </div>
                      <span className="text-muted-foreground">{isExpanded ? "▲" : "▼"}</span>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border p-4 space-y-4">
                        {/* Quick Info */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-muted/50 rounded-xl p-3">
                            <p className="text-muted-foreground text-xs">Budget</p>
                            <p className="font-bold text-foreground">{trip.currency?.symbol || "$"}{trip.totalBudget}</p>
                          </div>
                          <div className="bg-muted/50 rounded-xl p-3">
                            <p className="text-muted-foreground text-xs">Travellers</p>
                            <p className="font-bold text-foreground">{trip.adults} adults, {trip.children} children</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportPdf(it)}
                            className="rounded-full flex-1"
                          >
                            <Download className="h-4 w-4 mr-1" /> Download PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteItinerary(it.id)}
                            className="rounded-full text-destructive border-destructive/30 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Checklist */}
                        <TripChecklist
                          itinerary={it}
                          nationality={profile?.nationality || ""}
                          onChecklistUpdate={(checklist) => updateChecklist(it.id, checklist)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Account;
