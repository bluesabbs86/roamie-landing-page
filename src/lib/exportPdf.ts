import jsPDF from "jspdf";

interface TripExport {
  destination: string;
  departure: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalBudget: number;
  allocations?: {
    flights: { percent: number; amount: number };
    hotel: { percent: number; amount: number };
    activities: { percent: number; amount: number };
    food: { percent: number; amount: number };
  };
  feasibility?: string;
  verdict?: string;
}

interface ExpenseExport {
  category: string;
  description: string;
  amount: number;
  dateAdded: string;
}

interface CurrencyExport {
  symbol: string;
  code: string;
  name: string;
}

export function exportTripPdf({
  trip,
  currency,
  expenses = [],
  itinerary = {},
  recommendations = [],
}: {
  trip: TripExport;
  currency: CurrencyExport;
  expenses?: ExpenseExport[];
  itinerary?: Record<string, string[]>;
  recommendations?: { id: string; name: string; estimatedCostPerPerson: number; duration: string }[];
}) {
  const doc = new jsPDF();
  const s = currency.symbol;
  let y = 20;
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;

  const addPage = () => { doc.addPage(); y = 20; };
  const checkPage = (needed: number) => { if (y + needed > 275) addPage(); };

  // Title
  doc.setFontSize(22);
  doc.setTextColor(255, 107, 107);
  doc.text("Roamie Trip Plan", margin, y);
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Exported ${new Date().toLocaleDateString()}`, margin, y);
  y += 12;

  // Trip Details
  doc.setFontSize(14);
  doc.setTextColor(45, 45, 45);
  doc.text("Trip Details", margin, y);
  y += 8;
  doc.setFontSize(10);
  const details = [
    `Destination: ${trip.destination}`,
    `From: ${trip.departure}`,
    `Dates: ${trip.checkIn} to ${trip.checkOut} (${trip.nights} nights)`,
    `Travellers: ${trip.adults} adult(s), ${trip.children} child(ren)`,
    `Total Budget: ${s}${trip.totalBudget.toFixed(2)} ${currency.code}`,
  ];
  if (trip.feasibility) details.push(`Feasibility: ${trip.feasibility}`);
  details.forEach((line) => {
    doc.text(line, margin, y);
    y += 6;
  });
  y += 6;

  // Budget Allocation
  if (trip.allocations) {
    checkPage(40);
    doc.setFontSize(14);
    doc.setTextColor(45, 45, 45);
    doc.text("Budget Allocation", margin, y);
    y += 8;
    doc.setFontSize(10);
    const cats = [
      { name: "Flights", data: trip.allocations.flights },
      { name: "Hotel", data: trip.allocations.hotel },
      { name: "Activities", data: trip.allocations.activities },
      { name: "Food & Misc", data: trip.allocations.food },
    ];
    cats.forEach((c) => {
      doc.text(`${c.name}: ${s}${c.data.amount.toFixed(2)} (${c.data.percent}%)`, margin, y);
      y += 6;
    });
    y += 6;
  }

  // Expenses
  if (expenses.length > 0) {
    checkPage(20);
    doc.setFontSize(14);
    doc.setTextColor(45, 45, 45);
    doc.text("Expense Log", margin, y);
    y += 8;
    doc.setFontSize(9);

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Table header
    doc.setTextColor(150, 150, 150);
    doc.text("Date", margin, y);
    doc.text("Category", margin + 30, y);
    doc.text("Description", margin + 60, y);
    doc.text("Amount", margin + 130, y);
    y += 5;
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y, margin + contentW, y);
    y += 4;

    doc.setTextColor(45, 45, 45);
    expenses.forEach((exp) => {
      checkPage(8);
      doc.text(exp.dateAdded || "-", margin, y);
      doc.text(exp.category, margin + 30, y);
      const desc = exp.description.length > 30 ? exp.description.substring(0, 30) + "..." : exp.description;
      doc.text(desc, margin + 60, y);
      doc.text(`${s}${exp.amount.toFixed(2)}`, margin + 130, y);
      y += 6;
    });
    y += 4;
    doc.setFontSize(10);
    doc.setTextColor(255, 107, 107);
    doc.text(`Total Spent: ${s}${totalSpent.toFixed(2)}`, margin, y);
    y += 4;
    doc.text(`Remaining: ${s}${(trip.totalBudget - totalSpent).toFixed(2)}`, margin, y);
    y += 10;
  }

  // Itinerary
  const itineraryDays = Object.entries(itinerary).filter(([, ids]) => ids.length > 0);
  if (itineraryDays.length > 0 && recommendations.length > 0) {
    checkPage(20);
    doc.setFontSize(14);
    doc.setTextColor(45, 45, 45);
    doc.text("Itinerary", margin, y);
    y += 8;
    doc.setFontSize(10);

    itineraryDays.sort().forEach(([dayKey, ids]) => {
      checkPage(12);
      const dayNum = dayKey.replace("day", "");
      doc.setTextColor(255, 107, 107);
      doc.text(`Day ${dayNum}`, margin, y);
      y += 6;
      doc.setTextColor(45, 45, 45);
      ids.forEach((id) => {
        checkPage(8);
        const act = recommendations.find((r) => r.id === id);
        if (act) {
          const cost = act.estimatedCostPerPerson > 0 ? `${s}${act.estimatedCostPerPerson}` : "Free";
          doc.text(`• ${act.name} — ${cost} pp, ${act.duration}`, margin + 4, y);
          y += 6;
        }
      });
      y += 4;
    });
  }

  // Verdict
  if (trip.verdict) {
    checkPage(20);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    const lines = doc.splitTextToSize(`Roamie says: "${trip.verdict}"`, contentW);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 6;
  }

  // Footer
  checkPage(10);
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text("Generated by Roamie — Plan smart. Spend less. Roam more.", margin, y);

  doc.save(`roamie-${trip.destination.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
