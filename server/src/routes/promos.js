const express = require("express");
const { prisma } = require("../lib/prisma");
const { daysUntil } = require("../lib/status");

const router = express.Router();

// A promo is "linked" (shown as relevant to you) when a matching item in your
// stock is either low or expiring soon — mirrors the design's hardcoded
// `linked`/`reason` pairing, but computed against real inventory instead.
async function withLinkage(promos) {
  const inventory = await prisma.inventoryItem.findMany();
  return promos.map((p) => {
    const match = p.matchKeyword
      ? inventory.find((it) => it.name.toLowerCase().includes(p.matchKeyword.toLowerCase()))
      : null;
    const dlcDays = match ? daysUntil(match.expiresAt) : null;
    const linked = Boolean(match && (match.lowStock || (dlcDays != null && dlcDays <= 5)));
    return {
      id: p.id,
      initial: p.initial,
      color: p.color,
      product: p.product,
      enseigne: p.enseigne,
      deal: p.deal,
      off: p.off,
      linked,
      reason: linked ? p.reason : "",
    };
  });
}

router.get("/", async (req, res) => {
  const promos = await prisma.promo.findMany({ orderBy: { sortOrder: "asc" } });
  const linked = await withLinkage(promos);
  res.json({
    all: linked,
    home: linked.filter((p) => p.linked).slice(0, 2),
  });
});

module.exports = router;
