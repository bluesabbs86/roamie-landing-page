import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import RoamieLogo from "@/components/RoamieLogo";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Also check if we already have a recovery session from the URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated! 🎉" });
      navigate("/account");
    } catch (error: any) {
      toast({ title: error.message || "Failed to reset password", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <RoamieLogo className="justify-center [&_span]:text-primary-foreground [&_svg]:text-primary-foreground [&_path]:stroke-white [&_circle]:fill-white" />
          <div className="bg-card rounded-2xl shadow-xl p-6 mt-8 space-y-4">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground text-sm">Verifying your reset link...</p>
            <p className="text-xs text-muted-foreground">
              If nothing happens, the link may have expired.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="rounded-full"
            >
              ← Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <RoamieLogo className="justify-center [&_span]:text-primary-foreground [&_svg]:text-primary-foreground [&_path]:stroke-white [&_circle]:fill-white" />
          <p className="text-primary-foreground/80 mt-2">Set your new password</p>
        </div>

        <form onSubmit={handleReset} className="bg-card rounded-2xl shadow-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">New Password</label>
            <Input
              type="password"
              className="rounded-xl"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Confirm Password</label>
            <Input
              type="password"
              className="rounded-xl"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full py-6 text-base font-bold"
          >
            {loading ? "Updating..." : "Update Password 🧡"}
          </Button>
        </form>

        <button
          onClick={() => navigate("/auth")}
          className="block mx-auto mt-4 text-primary-foreground/70 hover:text-primary-foreground text-sm"
        >
          ← Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
