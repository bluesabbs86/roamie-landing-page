import { Currency } from "@/contexts/CurrencyContext";

interface Props {
  trip: {
    departure: string;
    destination: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    adults: number;
    children: number;
    totalBudget: number;
  };
  currency: Currency;
}

const TripHeaderBar = ({ trip, currency }: Props) => {
  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    } catch {
      return d;
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary to-secondary px-4 py-5 md:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-display font-bold text-primary-foreground">
            {trip.destination}
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            🛫 {trip.departure} → {trip.destination}
          </p>
          <p className="text-primary-foreground/80 text-sm">
            📅 {formatDate(trip.checkIn)} – {formatDate(trip.checkOut)}{" "}
            <span className="bg-primary-foreground/20 text-primary-foreground text-xs px-2 py-0.5 rounded-full ml-1">
              {trip.nights} nights
            </span>
          </p>
          <p className="text-primary-foreground/80 text-sm">
            👥 {trip.adults} adult{trip.adults > 1 ? "s" : ""}
            {trip.children > 0 ? ` · ${trip.children} child${trip.children > 1 ? "ren" : ""}` : ""}
          </p>
        </div>
        <div className="text-right md:text-right">
          <p className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">
            {currency.symbol}{trip.totalBudget.toLocaleString()}
          </p>
          <p className="text-primary-foreground/70 text-xs">Total Trip Budget</p>
        </div>
      </div>
    </div>
  );
};

export default TripHeaderBar;
