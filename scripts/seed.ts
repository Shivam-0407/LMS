const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        {
          name: "Computer Science",
        },
        {
          name: "Music ",
        },
        {
          name: "Fitness ",
        },
        {
          name: "Photograghy ",
        },
        {
          name: "Engineering ",
        },
        {
          name: "Filming ",
        },
        {
          name: "Video Editing",
        },
        {
          name: "VFX",
        },
      ],
    });
    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database ", error);
  } finally {
    await database.$disconnect();
  }
}

main()
