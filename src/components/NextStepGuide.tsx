import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface NextStepGuideProps {
  emoji: string;
  message: string;
  ctaLabel: string;
  href: string;
  variant?: "default" | "subtle";
}

const NextStepGuide = ({ emoji, message, ctaLabel, href, variant = "default" }: NextStepGuideProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className={`flex items-center gap-3 rounded-2xl px-5 py-3 cursor-pointer group ${
        variant === "subtle"
          ? "bg-accent/50 border border-border hover:bg-accent"
          : "bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 hover:border-primary/40"
      } transition-all`}
      onClick={() => navigate(href)}
    >
      <span className="text-2xl shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{message}</p>
      </div>
      <motion.div
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="shrink-0"
      >
        <div className="flex items-center gap-1 text-primary font-semibold text-sm whitespace-nowrap">
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NextStepGuide;
