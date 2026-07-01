const DAY_MS = 24 * 60 * 60 * 1000;

function daysUntil(expiresAt) {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(diff / DAY_MS);
}

// Mirrors the status() helper from the Cagette design prototype (Cagette.dc.html).
function statusFor(dlcDays) {
  if (dlcDays == null) return { text: "Longue conservation", color: "#6F6659", bg: "#EFE9DF" };
  if (dlcDays <= 0) return { text: "Périme aujourd’hui", color: "#C0492B", bg: "#F7E5DE" };
  if (dlcDays <= 1) return { text: "Périme demain", color: "#C0492B", bg: "#F7E5DE" };
  if (dlcDays <= 3) return { text: `${dlcDays} jours restants`, color: "#B07A1E", bg: "#F8EEDB" };
  return { text: `${dlcDays} jours`, color: "#3C7E4D", bg: "#E9F3EB" };
}

function enrichInventoryItem(item) {
  const dlcDays = daysUntil(item.expiresAt);
  const status = statusFor(dlcDays);
  return {
    ...item,
    dlcDays,
    qtyLabel: item.qty + (item.unit ? " " + item.unit : ""),
    statusText: status.text,
    statusColor: status.color,
    statusBg: status.bg,
  };
}

module.exports = { daysUntil, statusFor, enrichInventoryItem };
