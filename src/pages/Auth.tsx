import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import RoamieLogo from "@/components/RoamieLogo";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") !== "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [nationality, setNationality] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/account");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/account");
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          toast({ title: "Please enter your name", variant: "destructive" });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, nationality },
          },
        });
        if (error) throw error;
        toast({ title: "Welcome to Roamie! 🧡" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back! 🧡" });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      const msg = isSignUp
        ? "If this email isn't already registered, your account has been created. Please check your email."
        : "Invalid email or password.";
      toast({ title: msg, variant: "destructive" });
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
            {isSignUp ? "Create your account to save trips" : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-xl p-6 space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name</label>
                <Input
                  className="rounded-xl"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Nationality</label>
                <Input
                  className="rounded-xl"
                  placeholder="e.g. American, British, Indian"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                />
              </div>
            </>
          )}
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full py-6 text-base font-bold"
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account 🧡" : "Sign In →"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-semibold hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>

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
