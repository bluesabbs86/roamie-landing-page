import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah K.",
    location: "Bali trip",
    quote: "Roamie saved me over $600 on my Bali trip. I got to do everything on my list and still came home under budget!",
    initials: "SK",
    rating: 5,
  },
  {
    name: "Marcus T.",
    location: "Europe backpacking",
    quote: "I've used a dozen travel apps. Roamie is the first one that actually understood my budget isn't flexible. Game changer.",
    initials: "MT",
    rating: 5,
  },
  {
    name: "Priya D.",
    location: "Japan adventure",
    quote: "The local deals alone paid for the app ten times over. Found restaurants I never would have discovered on my own.",
    initials: "PD",
    rating: 5,
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-warm-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Travelers love us</span>
          <h2 className="font-display text-4xl md:text-5xl font-800 text-foreground mt-3">
            Don't just take our word for it
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-3xl p-8 md:p-12 shadow-sm border border-border/50 text-center"
          >
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-sunset text-sunset" />
              ))}
            </div>
            <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8 font-medium">
              "{testimonials[current].quote}"
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <Avatar className="h-12 w-12 bg-gradient-to-br from-coral to-sunset">
                <AvatarFallback className="bg-gradient-to-br from-coral to-sunset text-primary-foreground font-bold">
                  {testimonials[current].initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="font-bold text-foreground">{testimonials[current].name}</div>
                <div className="text-sm text-muted-foreground">{testimonials[current].location}</div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === current ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
