import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Set your budget",
    description: "Tell Roamie how much you want to spend and where you dream of going.",
    emoji: "💰",
  },
  {
    number: "02",
    title: "Get personalized plans",
    description: "Our AI builds a perfect itinerary — flights, stays, food, and fun — all within budget.",
    emoji: "🗺️",
  },
  {
    number: "03",
    title: "Book & go",
    description: "Lock in the best deals with one tap and start packing. Adventure awaits!",
    emoji: "✈️",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-accent/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">How it works</span>
          <h2 className="font-display text-4xl md:text-5xl font-800 text-foreground mt-3">
            Three steps to your next trip
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting dotted line */}
          <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-primary/20" />

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="text-center relative"
              >
                <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-coral to-sunset flex items-center justify-center text-3xl shadow-lg shadow-primary/20">
                  {step.emoji}
                </div>
                <div className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-2">
                  Step {step.number}
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
