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
  recommendations?: { id: string; name: string; estimatedCostPerPerson: number; duration: string; mapsQuery?: string; category?: string }[];
}) {
  const s = currency.symbol;
  const totalPeople = trip.adults + (trip.children || 0);

  // Budget allocation rows
  const allocationRows = trip.allocations
    ? [
        { name: "✈️ Flights", ...trip.allocations.flights },
        { name: "🏨 Hotel", ...trip.allocations.hotel },
        { name: "🎯 Activities", ...trip.allocations.activities },
        { name: "🍽️ Food & Misc", ...trip.allocations.food },
      ]
    : [];

  // Expense totals
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Itinerary days
  const itineraryDays = Object.entries(itinerary)
    .filter(([, ids]) => ids.length > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  let grandTotal = 0;
  const daysSections = itineraryDays.map(([dayKey, ids]) => {
    const dayNum = dayKey.replace("day", "");
    let dayLabel = `Day ${dayNum}`;
    if (trip.checkIn) {
      const d = new Date(trip.checkIn);
      d.setDate(d.getDate() + parseInt(dayNum) - 1);
      dayLabel += ` — ${d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}`;
    }

    let dayTotal = 0;
    const activities = ids
      .map((id) => recommendations.find((r) => r.id === id))
      .filter(Boolean)
      .map((act) => {
        const groupCost = act!.estimatedCostPerPerson * totalPeople;
        dayTotal += groupCost;
        const costStr = act!.estimatedCostPerPerson > 0
          ? `${s}${groupCost.toFixed(0)} (${s}${act!.estimatedCostPerPerson}/pp)`
          : "Free";
        return `
          <div style="margin-bottom:10px;">
            <div style="font-weight:600;color:#2d2d2d;font-size:13px;">• ${act!.name}</div>
            <div style="color:#888;font-size:11px;margin-left:12px;">${costStr} · ${act!.duration}${act!.category ? ` · ${act!.category}` : ""}</div>
            ${act!.mapsQuery ? `<div style="color:#648cc8;font-size:11px;margin-left:12px;">📍 ${act!.mapsQuery}</div>` : ""}
          </div>`;
      })
      .join("");

    grandTotal += dayTotal;

    return `
      <div style="margin-bottom:16px;">
        <div style="font-weight:700;color:#ff6b6b;font-size:14px;margin-bottom:6px;">${dayLabel}</div>
        ${activities}
        <div style="font-size:11px;color:#ff6b6b;font-weight:600;margin-top:4px;">Day ${dayNum} total: ${s}${dayTotal.toFixed(0)}</div>
      </div>`;
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Roamie Trip Plan — ${trip.destination}</title>
<style>
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
    @page { margin: 20mm; }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #2d2d2d;
    background: #fff;
    padding: 40px;
    max-width: 800px;
    margin: 0 auto;
  }
  .header {
    text-align: center;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 3px solid #ff6b6b;
  }
  .header h1 {
    font-size: 28px;
    color: #ff6b6b;
    margin-bottom: 4px;
    letter-spacing: -0.5px;
  }
  .header .destination {
    font-size: 20px;
    color: #2d2d2d;
    font-weight: 600;
  }
  .header .date {
    font-size: 11px;
    color: #999;
    margin-top: 6px;
  }
  .section {
    margin-bottom: 28px;
  }
  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #2d2d2d;
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 2px solid #f0f0f0;
  }
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 24px;
  }
  .detail-item {
    font-size: 13px;
    line-height: 1.5;
  }
  .detail-label {
    color: #999;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .budget-bar {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .budget-card {
    flex: 1;
    min-width: 140px;
    background: #fafafa;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 12px;
    text-align: center;
  }
  .budget-card .label { font-size: 11px; color: #999; }
  .budget-card .amount { font-size: 16px; font-weight: 700; color: #2d2d2d; }
  .budget-card .pct { font-size: 11px; color: #ff6b6b; }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  th {
    text-align: left;
    color: #999;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 6px 8px;
    border-bottom: 2px solid #f0f0f0;
  }
  td {
    padding: 6px 8px;
    border-bottom: 1px solid #f5f5f5;
  }
  .total-row {
    font-weight: 700;
    color: #ff6b6b;
    font-size: 13px;
    margin-top: 8px;
  }
  .itinerary-summary {
    background: #fff5f5;
    border: 1px solid #ffe0e0;
    border-radius: 10px;
    padding: 16px;
    text-align: center;
    margin-top: 12px;
  }
  .itinerary-summary .big { font-size: 20px; font-weight: 700; color: #2d2d2d; }
  .itinerary-summary .sub { font-size: 12px; color: #888; margin-top: 4px; }
  .verdict {
    background: #f9f9f9;
    border-left: 4px solid #ff6b6b;
    padding: 14px 18px;
    font-style: italic;
    color: #666;
    font-size: 13px;
    border-radius: 0 8px 8px 0;
  }
  .footer {
    text-align: center;
    color: #ccc;
    font-size: 10px;
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }
  .print-btn {
    display: block;
    margin: 0 auto 24px;
    background: #ff6b6b;
    color: #fff;
    border: none;
    padding: 12px 32px;
    border-radius: 999px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
  }
  .print-btn:hover { background: #e55a5a; }
</style>
</head>
<body>

<button class="print-btn no-print" onclick="window.print()">🖨️ Print / Save as PDF</button>

<div class="header">
  <h1>🌍 Roamie Trip Plan</h1>
  <div class="destination">${trip.destination}</div>
  <div class="date">Exported ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
</div>

<div class="section">
  <div class="section-title">📋 Trip Details</div>
  <div class="detail-grid">
    <div class="detail-item"><span class="detail-label">From</span><br/>${trip.departure}</div>
    <div class="detail-item"><span class="detail-label">Destination</span><br/>${trip.destination}</div>
    <div class="detail-item"><span class="detail-label">Dates</span><br/>${trip.checkIn} → ${trip.checkOut} (${trip.nights} nights)</div>
    <div class="detail-item"><span class="detail-label">Travellers</span><br/>${trip.adults} adult(s), ${trip.children} child(ren)</div>
    <div class="detail-item"><span class="detail-label">Total Budget</span><br/><strong>${s}${trip.totalBudget.toFixed(2)} ${currency.code}</strong></div>
    ${trip.feasibility ? `<div class="detail-item"><span class="detail-label">Feasibility</span><br/>${trip.feasibility}</div>` : ""}
  </div>
</div>

${trip.allocations ? `
<div class="section">
  <div class="section-title">💰 Budget Allocation</div>
  <div class="budget-bar">
    ${allocationRows.map((c) => `
      <div class="budget-card">
        <div class="label">${c.name}</div>
        <div class="amount">${s}${c.amount.toFixed(0)}</div>
        <div class="pct">${c.percent}%</div>
      </div>
    `).join("")}
  </div>
</div>
` : ""}

${expenses.length > 0 ? `
<div class="section">
  <div class="section-title">🧾 Expense Log</div>
  <table>
    <thead><tr><th>Date</th><th>Category</th><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>
      ${expenses.map((e) => `
        <tr>
          <td>${e.dateAdded || "—"}</td>
          <td>${e.category}</td>
          <td>${e.description}</td>
          <td style="text-align:right">${s}${e.amount.toFixed(2)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
  <div class="total-row" style="margin-top:10px;">
    Total Spent: ${s}${totalSpent.toFixed(2)} &nbsp;|&nbsp; Remaining: ${s}${(trip.totalBudget - totalSpent).toFixed(2)}
  </div>
</div>
` : ""}

${daysSections.length > 0 ? `
<div class="section">
  <div class="section-title">🗓️ Day-by-Day Itinerary</div>
  ${daysSections.join("")}
  <div class="itinerary-summary">
    <div class="big">${s}${grandTotal.toFixed(0)}</div>
    <div class="sub">Total Itinerary Cost</div>
    ${trip.allocations ? `<div class="sub" style="color:${trip.allocations.activities.amount - grandTotal >= 0 ? '#22a' : '#d33'};font-weight:600;margin-top:4px;">Activities Budget Remaining: ${s}${(trip.allocations.activities.amount - grandTotal).toFixed(0)}</div>` : ""}
  </div>
</div>
` : ""}

${trip.verdict ? `
<div class="section">
  <div class="verdict">🤖 Roamie says: "${trip.verdict}"</div>
</div>
` : ""}

<div class="footer">Generated by Roamie — Plan smart. Spend less. Roam more. 🌍</div>

</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
