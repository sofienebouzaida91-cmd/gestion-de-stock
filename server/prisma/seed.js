const { PrismaClient } = require("@prisma/client");
const { promos, inventoryCreateData } = require("./seedData");

const prisma = new PrismaClient();

async function main() {
  await prisma.receiptItem.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.promo.deleteMany();

  const inventoryData = inventoryCreateData();
  await prisma.inventoryItem.createMany({ data: inventoryData });
  await prisma.promo.createMany({ data: promos });

  console.log(`Seeded ${inventoryData.length} inventory items and ${promos.length} promos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
