interface TierSelectorProps {
  activeTier: string;
  onTierChange: (tier: string) => void;
  counts: { free: number; budget: number; splurge: number };
  activitiesRemaining: number;
}

const tiers = [
  { key: "free", icon: "🆓", label: "Free" },
  { key: "budget", icon: "💚", label: "Budget" },
  { key: "splurge", icon: "✨", label: "Splurge" },
];

const TierSelector = ({ activeTier, onTierChange, counts, activitiesRemaining }: TierSelectorProps) => {
  const budgetExhausted = activitiesRemaining <= 0;

  return (
    <div className="flex justify-center gap-3 py-4">
      {tiers.map((tier) => {
        const isActive = activeTier === tier.key;
        const isDisabled = budgetExhausted && tier.key !== "free";
        const count = counts[tier.key as keyof typeof counts];

        return (
          <button
            key={tier.key}
            onClick={() => !isDisabled && onTierChange(tier.key)}
            disabled={isDisabled}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              isActive
                ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                : isDisabled
                ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                : "bg-card border border-border text-foreground hover:border-primary"
            }`}
            title={isDisabled ? "You've used your activities budget" : undefined}
          >
            {tier.icon} {tier.label} {count > 0 && `(${count})`}
          </button>
        );
      })}
    </div>
  );
};

export default TierSelector;
