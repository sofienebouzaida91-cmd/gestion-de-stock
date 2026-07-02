const { promos, inventoryCreateData } = require("../../prisma/seedData");

// Hosting platforms whose free tier has no shell access (e.g. Render) can't run
// `npm run seed` manually. Seed automatically on boot, but only when the
// database is empty, so it never wipes real data on a later restart/redeploy.
async function autoSeedIfEmpty(prisma) {
  const count = await prisma.inventoryItem.count();
  if (count > 0) return;

  const inventoryData = inventoryCreateData();
  await prisma.inventoryItem.createMany({ data: inventoryData });
  await prisma.promo.createMany({ data: promos });
  console.log(`Auto-seeded ${inventoryData.length} inventory items and ${promos.length} promos (empty database).`);
}

module.exports = { autoSeedIfEmpty };
