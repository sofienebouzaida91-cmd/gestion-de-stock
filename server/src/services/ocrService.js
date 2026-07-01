// Receipt OCR service.
//
// If OCR_API_KEY (and OCR_PROVIDER) are configured, parseReceipt() calls the
// real provider's receipt-parsing endpoint. Without a key configured, it falls
// back to a fixed demo parse so the rest of the scan flow (upload -> confirm ->
// add to inventory) can be built and tested end-to-end before a provider is
// wired up. Swap DEMO_PARSE / addRealProvider() out once a key is available.

const DEMO_PARSE = {
  store: "Super Frais",
  purchasedAt: new Date(),
  total: 13.13,
  items: [
    { name: "Lait demi-écrémé", emoji: "🥛", qty: 2, unit: "briques", category: "Frais", dlcDays: 5 },
    { name: "Pâtes penne 500g", emoji: "🍝", qty: 1, unit: "paquet", category: "Épicerie", dlcDays: null },
    { name: "Café moulu 250g", emoji: "☕", qty: 1, unit: "paquet", category: "Épicerie", dlcDays: null },
    { name: "Bananes", emoji: "🍌", qty: 6, unit: "pièces", category: "Fruits & légumes", dlcDays: 5 },
    { name: "Yaourt nature", emoji: "🥣", qty: 8, unit: "pots", category: "Frais", dlcDays: 14 },
    { name: "Pain de mie", emoji: "🍞", qty: 1, unit: "paquet", category: "Épicerie", dlcDays: 6 },
  ],
};

async function callRealProvider(imageBuffer) {
  const provider = process.env.OCR_PROVIDER;
  const apiKey = process.env.OCR_API_KEY;

  if (provider === "mindee") {
    const res = await fetch("https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict", {
      method: "POST",
      headers: { Authorization: `Token ${apiKey}` },
      body: (() => {
        const form = new FormData();
        form.append("document", new Blob([imageBuffer]), "receipt.jpg");
        return form;
      })(),
    });
    if (!res.ok) throw new Error(`Mindee OCR request failed: ${res.status}`);
    const json = await res.json();
    return normalizeMindeeResponse(json);
  }

  throw new Error(`Unsupported OCR_PROVIDER: ${provider}`);
}

function normalizeMindeeResponse(json) {
  const prediction = json?.document?.inference?.prediction ?? {};
  const items = (prediction.line_items ?? []).map((li) => ({
    name: li.description || "Article",
    emoji: "🛒",
    qty: Math.max(1, Math.round(li.quantity ?? 1)),
    unit: null,
    category: "Épicerie",
    dlcDays: null,
  }));
  return {
    store: prediction.supplier_name?.value || "Ticket de caisse",
    purchasedAt: prediction.date?.value ? new Date(prediction.date.value) : new Date(),
    total: prediction.total_amount?.value ?? 0,
    items,
  };
}

async function parseReceipt(imageBuffer) {
  const hasLiveProvider = Boolean(process.env.OCR_API_KEY && process.env.OCR_PROVIDER);

  if (hasLiveProvider) {
    return callRealProvider(imageBuffer);
  }

  // Simulate the recognition delay from the design prototype.
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    store: DEMO_PARSE.store,
    purchasedAt: DEMO_PARSE.purchasedAt,
    total: DEMO_PARSE.total,
    items: DEMO_PARSE.items.map((it) => ({ ...it })),
  };
}

module.exports = { parseReceipt };
