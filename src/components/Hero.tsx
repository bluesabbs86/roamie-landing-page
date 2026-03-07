import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import RoamieLogo from "@/components/RoamieLogo";
import NextStepGuide from "@/components/NextStepGuide";
import { MapPin, Plane, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-coral via-primary to-sunset">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 opacity-10">
          <MapPin className="h-24 w-24 text-primary-foreground" />
        </div>
        <div className="absolute top-40 right-20 opacity-10">
          <Plane className="h-16 w-16 text-primary-foreground rotate-45" />
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-10">
          <Globe className="h-20 w-20 text-primary-foreground" />
        </div>
        {/* Dotted travel line */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.07]" viewBox="0 0 1200 800">
          <path
            d="M-50 400 Q200 100 400 350 T800 250 T1250 400"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="12 8"
            fill="none"
          />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 lg:px-20">
        <RoamieLogo className="[&_span]:text-primary-foreground [&_svg]:text-primary-foreground [&_path]:stroke-white [&_circle]:fill-white" />
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium text-sm">Features</a>
          <a href="#how-it-works" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium text-sm">How It Works</a>
          <a href="#testimonials" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium text-sm">Testimonials</a>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/auth?mode=login")}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full px-6"
          >
            Log In
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/auth?mode=signup")}
            className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 rounded-full px-6"
          >
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary-foreground/15 text-primary-foreground text-sm font-medium backdrop-blur-sm"
            >
              ✈️ Plan smarter, travel further
            </motion.div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-900 text-primary-foreground leading-[1.05] mb-6">
              Your budget.
              <br />
              Your{" "}
              <span className="relative">
                adventure.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8 Q50 2 100 6 T198 4" stroke="hsl(var(--warm-white))" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-lg mb-10 leading-relaxed">
              Roamie crafts personalized itineraries that match your wanderlust and your wallet. 
              No compromises — just smarter travel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                data-tour="start-planning"
                size="lg"
                onClick={() => navigate("/plan")}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8 py-6 text-base font-bold shadow-lg shadow-black/10"
              >
                Start Planning
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary-foreground/40 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 rounded-full px-8 py-6 text-base font-bold"
              >
                See How It Works
              </Button>
            </div>
            <div className="mt-8">
              <NextStepGuide
                emoji="🚀"
                message="Start here — plan your first trip in 3 easy steps"
                ctaLabel="Let's go"
                href="/plan"
              />
            </div>
          </motion.div>

          {/* App mockup placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="relative mx-auto w-[300px] h-[580px] bg-primary-foreground/10 backdrop-blur-md rounded-[2.5rem] border-2 border-primary-foreground/20 p-3 shadow-2xl">
              <div className="w-full h-full rounded-[2rem] bg-primary-foreground/95 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs text-muted-foreground">Good morning! 👋</div>
                      <div className="font-display font-bold text-foreground">Where to next?</div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-coral to-sunset" />
                  </div>
                  <div className="bg-muted rounded-2xl p-3 mb-4">
                    <div className="text-xs text-muted-foreground mb-1">Budget remaining</div>
                    <div className="font-display text-2xl font-bold text-foreground">$1,247</div>
                    <div className="mt-2 h-2 rounded-full bg-border overflow-hidden">
                      <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-coral to-sunset" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {["Bali · 7 days", "Lisbon · 5 days", "Tokyo · 10 days"].map((trip, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-coral/20 to-sunset/20 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{trip}</div>
                          <div className="text-xs text-muted-foreground">From ${(400 + i * 280)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full">
          <path d="M0 40 Q360 90 720 40 T1440 50 V100 H0 Z" fill="hsl(var(--warm-white))" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
