import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const CTASection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("You're on the list! 🎉 We'll be in touch soon.");
      setEmail("");
    }
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-coral via-primary to-sunset" />
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.06]" viewBox="0 0 1200 500">
          <path d="M-50 250 Q200 50 400 200 T800 150 T1250 250" stroke="white" strokeWidth="3" strokeDasharray="12 8" fill="none" />
          <path d="M-50 350 Q300 150 500 300 T900 200 T1250 350" stroke="white" strokeWidth="2" strokeDasharray="8 6" fill="none" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-display text-4xl md:text-5xl font-900 text-primary-foreground mb-4">
            Go further for less.
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10">
            Join thousands of smart travelers already planning their next adventure with Roamie.
            Be the first to know when we launch.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-full bg-primary-foreground/15 border-primary-foreground/25 text-primary-foreground placeholder:text-primary-foreground/50 h-12 px-5 backdrop-blur-sm focus-visible:ring-primary-foreground/30"
            />
            <Button
              type="submit"
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8 h-12 font-bold shadow-lg shadow-black/10 whitespace-nowrap"
            >
              Join Waitlist
            </Button>
          </form>
          <p className="text-xs text-primary-foreground/50 mt-4">Free to join. No spam, ever. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
