import { motion } from "framer-motion";
import { Users, Lightbulb, Rocket } from "lucide-react";

const team = [
  "Amber Sabbs",
  "Snehal Kajaria",
  "Bosede Akinbolusere",
  "Chris Kulp",
  "Sunil Ganu",
  "Wael Charfi",
  "Raja R.",
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            About Roamie
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-800 text-foreground mt-3 mb-4">
            Built for the AI Accelerator Hackathon
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Roamie leverages cutting-edge AI to provide personalized, context-aware recommendations — making every journey more intuitive, efficient, and enriching.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {[
            {
              icon: Lightbulb,
              title: "Our Mission",
              description:
                "To redefine how people discover and connect with the world around them — whether across the city or across the globe.",
            },
            {
              icon: Rocket,
              title: "The Challenge",
              description:
                "We built Roamie to solve the problem of information overload and generic suggestions, creating a smarter companion for exploration.",
            },
            {
              icon: Users,
              title: "The Team",
              description:
                "A passionate group of innovators combining AI, design, and travel expertise to build the future of trip planning.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral/15 to-sunset/15 flex items-center justify-center mb-6 mx-auto">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-8">
            Meet the Team
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {team.map((name) => (
              <span
                key={name}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-coral/10 to-sunset/10 border border-primary/20 text-foreground font-medium text-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
