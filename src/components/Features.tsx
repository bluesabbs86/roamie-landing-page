import { motion } from "framer-motion";
import { Wallet, Sparkles, BadgePercent } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Smart Budget Tracking",
    description: "Set your budget and watch Roamie work its magic. Real-time tracking keeps you on track without killing the vibe.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Itineraries",
    description: "Tell us what you love, and our AI builds a day-by-day plan tailored to your style, pace, and budget.",
  },
  {
    icon: BadgePercent,
    title: "Local Deal Finder",
    description: "Insider prices on stays, eats, and experiences. We dig up deals so you don't have to.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32 bg-warm-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Why Roamie?</span>
          <h2 className="font-display text-4xl md:text-5xl font-800 text-foreground mt-3 mb-4">
            Roam smart. Spend less.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to plan unforgettable trips without the budget anxiety.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="group relative bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border/50"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral/15 to-sunset/15 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
