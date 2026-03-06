import { useState } from "react";
import { useCurrency, currencies } from "@/contexts/CurrencyContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TripData {
  departure: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalBudget: number;
}

interface Step1Props {
  onNext: (data: TripData) => void;
}

const Step1TripDetails = ({ onNext }: Step1Props) => {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!departure.trim()) e.departure = "Oops! Tell us where you're flying from 🛫";
    if (!destination.trim()) e.destination = "Oops! Tell us where you're headed 🗺️";
    if (!checkIn || !checkOut) e.dates = "Both dates are required 📅";
    else if (new Date(checkOut) <= new Date(checkIn))
      e.dates = "Return date must be after departure 📅";
    if (!budget || parseFloat(budget) <= 0)
      e.budget = "Enter a budget greater than 0 💰";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onNext({
      departure,
      destination,
      checkIn,
      checkOut,
      nights,
      adults,
      children,
      totalBudget: parseFloat(budget),
    });
  };

  const Stepper = ({
    label,
    value,
    min,
    onChange,
  }: {
    label: string;
    value: number;
    min: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex-1">
      <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          −
        </button>
        <span className="text-lg font-bold text-foreground w-6 text-center">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(10, value + 1))}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="rounded-2xl shadow-lg overflow-hidden bg-card">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 text-center">
          <div className="text-4xl mb-2">✈️</div>
          <h2 className="font-display text-2xl font-bold text-primary-foreground">
            Where does Roamie take you next?
          </h2>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Tell us about your trip and budget
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Departure */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Departure City
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🛫</span>
              <Input
                className="pl-10 rounded-xl focus:ring-primary"
                placeholder="Flying from... (e.g. Dubai)"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
              />
            </div>
            {errors.departure && (
              <p className="text-sm text-primary mt-1">{errors.departure}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Destination
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">📍</span>
              <Input
                className="pl-10 rounded-xl focus:ring-primary"
                placeholder="Where to? (e.g. Bangkok, Bali, London)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            {errors.destination && (
              <p className="text-sm text-primary mt-1">{errors.destination}</p>
            )}
          </div>

          {/* Dates */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Departure Date
                </label>
                <Input
                  type="date"
                  className="rounded-xl"
                  min={new Date().toISOString().split("T")[0]}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Return Date
                </label>
                <Input
                  type="date"
                  className="rounded-xl"
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
            {nights > 0 && (
              <div className="mt-2">
                <span className="inline-block bg-accent text-primary text-sm font-semibold px-3 py-1 rounded-full">
                  ✈️ {nights} night{nights !== 1 ? "s" : ""}
                </span>
              </div>
            )}
            {errors.dates && (
              <p className="text-sm text-primary mt-1">{errors.dates}</p>
            )}
          </div>

          {/* Travellers */}
          <div>
            <div className="flex gap-6">
              <Stepper label="Adults" value={adults} min={1} onChange={setAdults} />
              <Stepper
                label="Children"
                value={children}
                min={0}
                onChange={setChildren}
              />
            </div>
            <p className="text-sm text-primary font-medium mt-2">
              👥 {adults} adult{adults !== 1 ? "s" : ""} · {children} child
              {children !== 1 ? "ren" : ""}
            </p>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Total Trip Budget
            </label>
            <div className="flex gap-3">
              <Select
                value={selectedCurrency.code}
                onValueChange={(code) => {
                  const c = currencies.find((c) => c.code === code);
                  if (c) setSelectedCurrency(c);
                }}
              >
                <SelectTrigger className="w-[120px] rounded-xl">
                  <SelectValue>
                    {selectedCurrency.flag} {selectedCurrency.code}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                className="flex-1 rounded-xl"
                placeholder="Enter your total budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground italic mt-1.5">
              Include everything — flights, hotel, food and fun
            </p>
            {errors.budget && (
              <p className="text-sm text-primary mt-1">{errors.budget}</p>
            )}
          </div>

          {/* CTA */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full py-6 text-base font-bold shadow-lg"
          >
            Plan My Trip with Roamie →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step1TripDetails;
