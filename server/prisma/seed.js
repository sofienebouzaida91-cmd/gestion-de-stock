const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function inDays(n) {
  if (n == null) return null;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}

// Mirrors the demo `inventory` array baked into the Cagette design prototype.
const inventory = [
  { name: "Salade verte", emoji: "🥬", qty: 1, unit: "pièce", dlcDays: 1, category: "Frais" },
  { name: "Lait demi-écrémé", emoji: "🥛", qty: 2, unit: "briques", dlcDays: 2, category: "Frais" },
  { name: "Œufs", emoji: "🥚", qty: 4, unit: "restants", dlcDays: 3, category: "Frais" },
  { name: "Comté", emoji: "🧀", qty: 1, unit: "200 g", dlcDays: 5, category: "Frais" },
  { name: "Yaourts nature", emoji: "🥣", qty: 8, unit: "pots", dlcDays: 6, category: "Frais" },
  { name: "Tomates", emoji: "🍅", qty: 6, unit: "pièces", dlcDays: 7, category: "Fruits & légumes" },
  { name: "Pommes", emoji: "🍎", qty: 5, unit: "pièces", dlcDays: 12, category: "Fruits & légumes" },
  { name: "Beurre doux", emoji: "🧈", qty: 1, unit: "plaquette", dlcDays: 20, category: "Frais" },
  { name: "Café moulu", emoji: "☕", qty: 1, unit: "presque vide", dlcDays: null, category: "Épicerie", lowStock: true },
  { name: "Pâtes penne", emoji: "🍝", qty: 1, unit: "paquet", dlcDays: null, category: "Épicerie", lowStock: true },
  { name: "Sucre en poudre", emoji: "🧂", qty: 1, unit: "fond de paquet", dlcDays: null, category: "Épicerie", lowStock: true },
  { name: "Riz basmati", emoji: "🍚", qty: 1, unit: "1 kg", dlcDays: null, category: "Épicerie" },
];

// Mirrors the demo `promoData` array from the design prototype.
const promos = [
  {
    initial: "C", color: "#2C6ECB", product: "Café moulu Grand-Mère 250g", enseigne: "Carrefour",
    deal: "2,99 € au lieu de 4,29 €", off: "-30%", matchKeyword: "café", reason: "Votre café est presque vide", sortOrder: 0,
  },
  {
    initial: "L", color: "#E5651E", product: "Pâtes Barilla 500g", enseigne: "Leclerc",
    deal: "2 achetés = 1 offert", off: "3=2", matchKeyword: "pâtes", reason: "Il ne vous reste qu’un paquet", sortOrder: 1,
  },
  {
    initial: "L", color: "#0C5CA8", product: "Lait demi-écrémé x6", enseigne: "Lidl",
    deal: "3,99 € au lieu de 5,40 €", off: "-26%", matchKeyword: "lait", reason: "Vous en consommez souvent", sortOrder: 2,
  },
  {
    initial: "I", color: "#C81B23", product: "Yaourts nature x16", enseigne: "Intermarché",
    deal: "2,49 € le pack", off: "-20%", matchKeyword: "yaourt", reason: "Vous en avez déjà plusieurs pots", sortOrder: 3,
  },
];

async function main() {
  await prisma.receiptItem.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.promo.deleteMany();

  await prisma.inventoryItem.createMany({
    data: inventory.map((it) => ({
      name: it.name,
      emoji: it.emoji,
      qty: it.qty,
      unit: it.unit,
      category: it.category,
      expiresAt: inDays(it.dlcDays),
      lowStock: Boolean(it.lowStock),
    })),
  });

  await prisma.promo.createMany({ data: promos });

  console.log(`Seeded ${inventory.length} inventory items and ${promos.length} promos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
