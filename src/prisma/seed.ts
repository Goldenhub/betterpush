import prisma from "./client";

async function main() {
  await prisma.$transaction(async (tx) => {
    const roles = [
      {
        name: "carrier",
        permissions: "test",
        description: "Role for carriers",
      },
      {
        name: "broker",
        permissions: "test",
        description: "Role for brokers",
      },
      {
        name: "driver",
        permissions: "test",
        description: "Role for drivers",
      },
    ] as const;

    for (const role of roles) {
      await tx.role.create({
        data: role,
      });
    }
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
