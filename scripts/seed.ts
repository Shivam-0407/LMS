const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    // Fetch existing categories
    const categories = await database.category.findMany({});

    // Deleting old categories if any exist
    if (categories.length > 0) {
      await database.category.deleteMany({});
    }

    // Creating new categories with corrected names
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Photography" }, // Corrected typo
        { name: "Engineering" },
        { name: "Filming" },
        { name: "Accounting" },
      ],
    });

    console.log("Success");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Disconnect the Prisma client
    await database.$disconnect();
  }
}

main();
