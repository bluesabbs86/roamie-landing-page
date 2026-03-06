import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const tabs = [
  { key: "plan", icon: "✈️", label: "Plan", path: "/plan" },
  { key: "budget", icon: "💰", label: "Budget", path: "/dashboard" },
  { key: "explore", icon: "🎯", label: "Explore", path: null },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string | null) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const disabled = tab.path === null;

          const button = (
            <button
              key={tab.key}
              onClick={() => {
                if (tab.path) navigate(tab.path);
              }}
              disabled={disabled}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-colors ${
                active
                  ? "text-primary"
                  : disabled
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );

          if (disabled) {
            return (
              <Tooltip key={tab.key}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Coming soon!</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
