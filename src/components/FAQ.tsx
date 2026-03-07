import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Roamie?",
    answer:
      "Roamie is a budget-first travel planning app that helps you build affordable trips by starting with your destinations—building your budget around what you want to do. It shows only options you can actually afford, with real-time budget tracking and smart recommendations.",
  },
  {
    question: "How does Roamie work?",
    answer:
      "1. Enter your total budget, trip details (travelers, nights, origin), and preferences.\n2. Roamie shows destinations and options that fit your budget—color-coded by feasibility.\n3. Select flights, hotels, and activities while watching your budget update in real time.\n4. Review and save your complete itinerary with a transparent budget breakdown.",
  },
  {
    question: "Is Roamie free to use?",
    answer:
      "Yes, Roamie is completely free. There are no hidden fees or subscription plans.",
  },
  {
    question: "Does Roamie book flights or hotels?",
    answer:
      "No—Roamie is a planning tool. It helps you find and compare affordable options, but you'll book through the airline or hotel's website directly.",
  },
  {
    question: "Which currencies does Roamie support?",
    answer:
      "Roamie supports USD, EUR, and GBP. All prices are shown in your selected currency.",
  },
  {
    question: "Can I adjust my budget after I start planning?",
    answer:
      "Yes! Use the option to go back and change your budget to explore different budget levels without losing your progress. You can apply or discard changes with one click.",
  },
  {
    question: "What if my budget is too low for any destination?",
    answer:
      "Roamie will show a constructive message with the minimum budget needed and suggest adjustments—like shortening your trip or adding a little more—to help make your trip possible.",
  },
  {
    question: "Can I save or share my itinerary?",
    answer:
      "Yes. You can copy a text summary to clipboard, save as PDF, or revisit your plan anytime during your session.",
  },
  {
    question: "Does Roamie include real-time prices?",
    answer:
      "Currently, Roamie uses realistic mock data for demonstration. Future versions may integrate live pricing APIs.",
  },
  {
    question: "How does Roamie decide which activities to recommend?",
    answer:
      "Activities are ranked by value-to-cost ratio and filtered to fit your remaining budget after flights and hotels are selected.",
  },
  {
    question: "Is my data stored?",
    answer:
      "Roamie stores your trip plan temporarily in your browser during your session. No personal data is saved permanently or shared.",
  },
  {
    question: "Who is Roamie for?",
    answer:
      "Anyone planning a trip on a budget—solo travelers, families, couples, or friends—who wants to maximize value without overspending.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 md:py-32 bg-warm-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-800 text-foreground mt-3 mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border/50 rounded-2xl px-6 bg-card shadow-sm"
              >
                <AccordionTrigger className="text-left font-display font-bold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-center text-muted-foreground text-sm mt-10">
            Need more help? Reach out at{" "}
            <a
              href="mailto:support@roamie.app"
              className="text-primary hover:underline font-medium"
            >
              support@roamie.app
            </a>
            . Happy travels! 🌍✈️
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
