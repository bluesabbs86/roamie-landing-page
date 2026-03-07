import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import TooltipTour from "@/components/TooltipTour";

const tourSteps = [
  {
    target: "[data-tour='start-planning']",
    title: "Welcome to Roamie! 🎉",
    description: "Start here to plan your first trip. We'll help you set a destination, budget, and build a personalised itinerary.",
  },
  {
    target: "[data-tour='features-section']",
    title: "Smart Features ✨",
    description: "Roamie helps you plan, budget, and explore — all powered by AI tailored to your travel style.",
  },
  {
    target: "[data-tour='how-it-works']",
    title: "3 Simple Steps 🗺️",
    description: "Plan your trip, set your budget, then explore activities. It's that easy!",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <TooltipTour steps={tourSteps} tourKey="landing" />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
