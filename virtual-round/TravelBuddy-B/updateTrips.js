const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const trips = await prisma.trip.findMany({ where: { is_public: true } });
  for (const trip of trips) {
    await prisma.trip.update({
      where: { id: trip.id },
      data: {
        name: trip.name.includes('Vadodara') ? trip.name : `${trip.name} in Vadodara`,
        description: trip.description ? `${trip.description} - Explore Vadodara` : 'A wonderful trip in Vadodara'
      }
    });
  }
  console.log(`Updated ${trips.length} trips to be Vadodara centric.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
