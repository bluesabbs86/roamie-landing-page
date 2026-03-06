import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Currency {
  code: string;
  symbol: string;
  flag: string;
  name: string;
}

export const currencies: Currency[] = [
  { code: "AED", symbol: "د.إ", flag: "🇦🇪", name: "UAE Dirham" },
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
  { code: "INR", symbol: "₹", flag: "🇮🇳", name: "Indian Rupee" },
];

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(() => {
    try {
      const stored = localStorage.getItem("roamie:currency");
      if (stored) return JSON.parse(stored);
    } catch {}
    return currencies[0]; // AED default
  });

  const setSelectedCurrency = (currency: Currency) => {
    setSelectedCurrencyState(currency);
    localStorage.setItem("roamie:currency", JSON.stringify(currency));
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
};
