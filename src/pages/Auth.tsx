import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import RoamieLogo from "@/components/RoamieLogo";

const Auth = () => {
  const navigate = useNavigate();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/account");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/account");
    });
  }, [navigate]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({ title: "Check your email for a reset link 📧" });
      setIsForgotPassword(false);
    } catch (error: any) {
      // Generic message to prevent account enumeration
      toast({ title: "If that email exists, a reset link has been sent." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Welcome back! 🧡" });
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({ title: "Invalid email or password.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <RoamieLogo className="justify-center [&_span]:text-primary-foreground [&_svg]:text-primary-foreground [&_path]:stroke-white [&_circle]:fill-white" />
          <p className="text-primary-foreground/80 mt-2">
            {isForgotPassword
              ? "Reset your password"
              : "Sign in to your account"}
          </p>
        </div>

        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="bg-card rounded-2xl shadow-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
              <Input
                type="email"
                className="rounded-xl"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              We'll send you a link to reset your password.
            </p>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full py-6 text-base font-bold"
            >
              {loading ? "Sending..." : "Send Reset Link 📧"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-primary font-semibold hover:underline"
              >
                ← Back to Sign In
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
              <Input
                type="email"
                className="rounded-xl"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
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

            <div className="text-right">
              <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full py-6 text-base font-bold"
            >
              {loading ? "Please wait..." : "Sign In →"}
            </Button>

          </form>
        )}

        <button
          onClick={() => navigate("/")}
          className="block mx-auto mt-4 text-primary-foreground/70 hover:text-primary-foreground text-sm"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
};

export default Auth;
