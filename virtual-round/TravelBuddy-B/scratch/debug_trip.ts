import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function debugTrip() {
  const id = '428593a5-1fea-4261-8c7d-05ae17f30a1a';
  console.log('Debugging trip:', id);
  
  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        user: true,
        stops: true
      }
    });
    console.log('Trip found:', !!trip);
    if (trip) {
      console.log('User ID:', trip.user_id);
      console.log('Stops count:', trip.stops.length);
    }
  } catch (err: any) {
    console.error('DATABASE ERROR:', err.message);
    console.error('Error Code:', err.code);
    console.error('Stack:', err.stack);
  } finally {
    await prisma.$disconnect();
  }
}

debugTrip();
