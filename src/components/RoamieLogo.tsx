import { MapPin } from "lucide-react";

const RoamieLogo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative">
      <MapPin className="h-8 w-8 text-primary" strokeWidth={2.5} />
      <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-3 h-2 rounded-b-full">
        <svg viewBox="0 0 12 8" className="w-3 h-2">
          <path d="M3 2 Q6 0 9 2" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="4.5" cy="4" r="0.8" fill="hsl(var(--primary))" />
          <circle cx="7.5" cy="4" r="0.8" fill="hsl(var(--primary))" />
        </svg>
      </div>
    </div>
    <span className="font-display text-2xl font-900 tracking-tight text-foreground">
      Roamie
    </span>
  </div>
);

export default RoamieLogo;
