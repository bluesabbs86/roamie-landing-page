interface Activity {
  id: string;
  category: string;
  categoryIcon: string;
  localTip: string;
}

interface InsiderTipsProps {
  destination: string;
  recommendations: Activity[];
}

const InsiderTips = ({ destination, recommendations }: InsiderTipsProps) => {
  const tips = recommendations.slice(0, 5);
  if (tips.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-foreground mb-4">
        🤫 Roamie's Insider Tips for {destination}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {tips.map((rec) => (
          <div
            key={rec.id}
            className="min-w-[250px] max-w-[300px] bg-card rounded-xl shadow-sm border-l-4 border-l-primary p-4 flex-shrink-0"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">{rec.categoryIcon}</span>
              <span className="text-xs text-muted-foreground">{rec.category}</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{rec.localTip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsiderTips;
