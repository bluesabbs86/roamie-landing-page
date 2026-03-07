import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingMessages = [
  { emoji: "🗺️", text: "Scanning hidden gems nearby..." },
  { emoji: "🎯", text: "Matching activities to your budget..." },
  { emoji: "🌍", text: "Asking locals for insider tips..." },
  { emoji: "✨", text: "Curating your perfect day out..." },
  { emoji: "🧡", text: "Almost there — polishing recommendations..." },
];

const ExploreLoadingAnimation = ({ destination }: { destination: string }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8">
      {/* Animated globe/compass */}
      <div className="relative w-24 h-24">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-primary/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-5xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          🧭
        </motion.div>
      </div>

      {/* Rotating messages */}
      <div className="h-16 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <span className="text-3xl block mb-2">{loadingMessages[msgIndex].emoji}</span>
            <p className="text-sm font-medium text-muted-foreground">
              {loadingMessages[msgIndex].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {loadingMessages.map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            animate={{
              backgroundColor: i === msgIndex ? "hsl(var(--primary))" : "hsl(var(--muted))",
              scale: i === msgIndex ? 1.3 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground/60">
        Roamie is personalising your {destination} adventure...
      </p>
    </div>
  );
};

export default ExploreLoadingAnimation;
