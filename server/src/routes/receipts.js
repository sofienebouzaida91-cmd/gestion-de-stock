const express = require("express");
const multer = require("multer");
const { prisma } = require("../lib/prisma");
const { parseReceipt } = require("../services/ocrService");

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = express.Router();

function dlcDaysToExpiresAt(dlcDays) {
  if (dlcDays == null) return null;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + dlcDays);
  return d;
}

function serializeReceipt(receipt) {
  return {
    id: receipt.id,
    store: receipt.store,
    purchasedAt: receipt.purchasedAt,
    total: receipt.total,
    status: receipt.status,
    items: receipt.items.map((it) => ({
      id: it.id,
      name: it.name,
      emoji: it.emoji,
      qty: it.qty,
      unit: it.unit,
      category: it.category,
      expiresAt: it.expiresAt,
      included: it.included,
      sub: it.category + (it.expiresAt ? ` · DLC ~${Math.max(1, Math.round((it.expiresAt - Date.now()) / 86400000))} j` : ""),
    })),
  };
}

// Take/upload a receipt photo -> run OCR -> store the parsed (editable) items.
router.post("/scan", upload.single("photo"), async (req, res) => {
  const parsed = await parseReceipt(req.file ? req.file.buffer : Buffer.alloc(0));

  const receipt = await prisma.receipt.create({
    data: {
      store: parsed.store,
      purchasedAt: parsed.purchasedAt,
      total: parsed.total,
      status: "pending",
      items: {
        create: parsed.items.map((it) => ({
          name: it.name,
          emoji: it.emoji,
          qty: it.qty,
          unit: it.unit,
          category: it.category,
          expiresAt: dlcDaysToExpiresAt(it.dlcDays),
          included: true,
        })),
      },
    },
    include: { items: true },
  });

  res.status(201).json(serializeReceipt(receipt));
});

// Add a missing item to a pending receipt before confirming.
router.post("/:id/items", async (req, res) => {
  const { name, emoji, qty, unit, category } = req.body;
  const item = await prisma.receiptItem.create({
    data: {
      receiptId: req.params.id,
      name,
      emoji: emoji || "🛒",
      qty: qty || 1,
      unit: unit ?? null,
      category: category || "Épicerie",
      included: true,
    },
  });
  res.status(201).json(item);
});

// Edit a scanned item's quantity / included state (± steppers, checkbox toggle).
router.patch("/:id/items/:itemId", async (req, res) => {
  const { qty, included } = req.body;
  const data = {};
  if (qty !== undefined) data.qty = Math.max(1, qty);
  if (included !== undefined) data.included = Boolean(included);
  const item = await prisma.receiptItem.update({ where: { id: req.params.itemId }, data });
  res.json(item);
});

// "Ajouter au stock" — turn the included scanned items into inventory items.
router.post("/:id/confirm", async (req, res) => {
  const receipt = await prisma.receipt.findUnique({
    where: { id: req.params.id },
    include: { items: true },
  });
  if (!receipt) return res.status(404).json({ error: "Receipt not found" });

  const toAdd = receipt.items.filter((it) => it.included);

  const created = await prisma.$transaction(
    toAdd.map((it) =>
      prisma.inventoryItem.create({
        data: {
          name: it.name.replace(/ \d+\w*$/, ""),
          emoji: it.emoji,
          qty: it.qty,
          unit: it.unit,
          category: it.category,
          expiresAt: it.expiresAt,
        },
      })
    )
  );

  await prisma.receipt.update({ where: { id: receipt.id }, data: { status: "confirmed" } });

  res.json({ addedCount: created.length, items: created });
});

module.exports = router;
