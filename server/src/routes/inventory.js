const express = require("express");
const { prisma } = require("../lib/prisma");
const { enrichInventoryItem } = require("../lib/status");

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await prisma.inventoryItem.findMany({ orderBy: { createdAt: "desc" } });
  const enriched = items.map(enrichInventoryItem);

  const expiring = enriched
    .filter((it) => it.dlcDays != null && it.dlcDays <= 3)
    .sort((a, b) => a.dlcDays - b.dlcDays);
  const low = enriched.filter((it) => it.lowStock);

  res.json({
    items: enriched,
    summary: {
      total: enriched.length,
      expiringCount: expiring.length,
      lowCount: low.length,
      alertTotal: expiring.length + low.length,
    },
    expiring,
    low,
  });
});

router.post("/", async (req, res) => {
  const { name, emoji, qty, unit, category, expiresAt, lowStock } = req.body;
  if (!name || !category || !qty) {
    return res.status(400).json({ error: "name, category and qty are required" });
  }
  const item = await prisma.inventoryItem.create({
    data: {
      name,
      emoji: emoji || "🛒",
      qty,
      unit: unit ?? null,
      category,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      lowStock: Boolean(lowStock),
    },
  });
  res.status(201).json(enrichInventoryItem(item));
});

// "Consommé" — item fully used up, remove from stock.
router.delete("/:id", async (req, res) => {
  await prisma.inventoryItem.delete({ where: { id: req.params.id } }).catch(() => null);
  res.status(204).end();
});

// "+ Liste" — mark a low-stock item as added to the shopping list.
router.post("/:id/add-to-list", async (req, res) => {
  const item = await prisma.inventoryItem.update({
    where: { id: req.params.id },
    data: { addedToList: true },
  });
  res.json(enrichInventoryItem(item));
});

module.exports = router;
