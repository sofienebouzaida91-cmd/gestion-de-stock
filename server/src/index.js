require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { prisma } = require("./lib/prisma");
const { autoSeedIfEmpty } = require("./lib/autoSeed");
const inventoryRoutes = require("./routes/inventory");
const receiptsRoutes = require("./routes/receipts");
const promosRoutes = require("./routes/promos");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/inventory", inventoryRoutes);
app.use("/api/receipts", receiptsRoutes);
app.use("/api/promos", promosRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const port = process.env.PORT || 4000;
autoSeedIfEmpty(prisma)
  .catch((e) => console.error("Auto-seed failed:", e))
  .finally(() => {
    app.listen(port, () => console.log(`Cagette API listening on :${port}`));
  });
