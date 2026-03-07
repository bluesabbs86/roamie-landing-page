import { motion } from "framer-motion";
import {
  Plane,
  PiggyBank,
  Map,
  Receipt,
  Sparkles,
  Users,
  CalendarOff,
  Train,
  Droplets,
  CreditCard,
  MapPin,
  Landmark,
  TreePine,
  Backpack,
  UtensilsCrossed,
  Umbrella,
} from "lucide-react";

import destinationKyoto from "@/assets/destination-kyoto.jpg";
import destinationPatagonia from "@/assets/destination-patagonia.jpg";
import destinationVietnam from "@/assets/destination-vietnam.jpg";
import destinationMexico from "@/assets/destination-mexico.jpg";
import destinationGreece from "@/assets/destination-greece.jpg";

const whyRoamie = [
  {
    icon: PiggyBank,
    title: "AI-Powered Budgeting",
    description:
      "Roamie analyzes your travel preferences, past spending habits, and real-time costs to create a personalized budget that adapts to your trip.",
  },
  {
    icon: Map,
    title: "Smart Itinerary Planning",
    description:
      "From must-see landmarks to hidden gems, Roamie crafts optimized daily itineraries based on your interests, time constraints, and budget.",
  },
  {
    icon: Receipt,
    title: "Expense Tracking & Alerts",
    description:
      "Track every dollar in real-time. Get spending alerts before you overshoot your budget, so you stay on track.",
  },
  {
    icon: Sparkles,
    title: "Local Insights & Deals",
    description:
      "Discover exclusive discounts on flights, hotels, and experiences. Roamie suggests the best local spots — no tourist traps!",
  },
  {
    icon: Users,
    title: "Collaborative Planning",
    description:
      "Traveling with friends or family? Share and sync itineraries so everyone stays on the same page (and budget).",
  },
];

const travelTips = [
  {
    icon: CalendarOff,
    title: "Travel Off-Peak",
    text: "Fly on a Tuesday or Wednesday and avoid holiday weekends for significantly cheaper flights and fewer crowds.",
  },
  {
    icon: Train,
    title: "Embrace Public Transit",
    text: "Not only is it budget-friendly, but it's also a great way to experience a city like a local.",
  },
  {
    icon: Droplets,
    title: "Pack a Reusable Bottle",
    text: "Save money and the planet by refilling your bottle instead of buying plastic ones.",
  },
  {
    icon: CreditCard,
    title: "Notify Your Bank",
    text: "Always tell your bank your travel dates to avoid frozen cards abroad.",
  },
  {
    icon: MapPin,
    title: "Download Offline Maps",
    text: "Save Google Maps for your destination offline so you can navigate even without data.",
  },
];

const vacationIdeas = [
  {
    icon: Landmark,
    title: "The Culture Seeker",
    destination: "Kyoto, Japan · Rome, Italy",
    text: "Immerse yourself in history — ancient temples, serene gardens, endless art and archaeology.",
    gradient: "from-coral/15 to-sunset/10",
    image: destinationKyoto,
  },
  {
    icon: TreePine,
    title: "The Nature Lover",
    destination: "Patagonia · Norway Fjords",
    text: "Reconnect with the outdoors — dramatic landscapes, glaciers, and pristine wilderness.",
    gradient: "from-green-500/10 to-emerald-500/10",
    image: destinationPatagonia,
  },
  {
    icon: Backpack,
    title: "The Budget Backpacker",
    destination: "Vietnam · Thailand",
    text: "Southeast Asia offers incredible food, rich culture, and amazing value for every traveler.",
    gradient: "from-amber-500/10 to-yellow-500/10",
    image: destinationVietnam,
  },
  {
    icon: UtensilsCrossed,
    title: "The Foodie Explorer",
    destination: "Mexico City · Lisbon, Portugal",
    text: "Take a culinary tour — vibrant street food, bustling markets, and unforgettable flavors.",
    gradient: "from-orange-500/10 to-red-400/10",
    image: destinationMexico,
  },
  {
    icon: Umbrella,
    title: "The Relaxation Chaser",
    destination: "Greek Islands",
    text: "Stunning sunsets and crystal-clear waters — perfect for a digital detox and total unwind.",
    gradient: "from-sky-500/10 to-blue-400/10",
    image: destinationGreece,
  },
];

const cardAnim = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
};

const BlogSection = () => {
  return (
    <section id="blog" className="relative overflow-hidden">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-coral via-primary to-sunset py-20 md:py-28 text-center relative">
        <div className="absolute inset-0 opacity-[0.06]">
          <svg className="w-full h-full" viewBox="0 0 1200 400">
            <path d="M-50 200 Q200 50 400 180 T800 120 T1250 200" stroke="white" strokeWidth="3" strokeDasharray="12 8" fill="none" />
          </svg>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...cardAnim} transition={{ duration: 0.6 }}>
            <Plane className="h-12 w-12 text-primary-foreground/80 mx-auto mb-4" />
            <h2 className="font-display text-4xl md:text-5xl font-900 text-primary-foreground mb-4">
              Travel Tips & Vacation Ideas
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Ready for your next adventure? Explore smarter, spend wiser — let Roamie be your guide.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Why Roamie */}
      <div className="bg-background py-20 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div {...cardAnim} transition={{ duration: 0.5 }} className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Why Roamie</span>
            <h3 className="font-display text-3xl md:text-4xl font-800 text-foreground mt-3">
              Your AI-Powered Travel Companion
            </h3>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {whyRoamie.map((item, i) => (
              <motion.div
                key={item.title}
                {...cardAnim}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card rounded-2xl p-7 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral/15 to-sunset/15 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Travel Tips */}
      <div className="bg-muted/40 py-20 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div {...cardAnim} transition={{ duration: 0.5 }} className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Smart Tips</span>
            <h3 className="font-display text-3xl md:text-4xl font-800 text-foreground mt-3">
              Travel Like a Pro
            </h3>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {travelTips.map((tip, i) => (
              <motion.div
                key={tip.title}
                {...cardAnim}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex gap-4 bg-card rounded-2xl p-6 border border-border/50 shadow-sm"
              >
                <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-sunset/15 to-coral/15 flex items-center justify-center">
                  <tip.icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-foreground mb-1">{tip.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tip.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Vacation Ideas with Images */}
      <div className="bg-background py-20 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div {...cardAnim} transition={{ duration: 0.5 }} className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Inspiration</span>
            <h3 className="font-display text-3xl md:text-4xl font-800 text-foreground mt-3">
              Vacation Ideas for Every Traveler
            </h3>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {vacationIdeas.map((idea, i) => (
              <motion.div
                key={idea.title}
                {...cardAnim}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-border/50 shadow-sm hover:shadow-lg transition-shadow overflow-hidden bg-card group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={idea.image}
                    alt={`${idea.title} - ${idea.destination}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <idea.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-white/90">{idea.destination}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-display text-lg font-bold text-foreground mb-1">{idea.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{idea.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            {...cardAnim}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-muted-foreground mt-12 text-lg font-medium"
          >
            Let Roamie help you turn these ideas into a perfectly planned reality! ✈️
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
