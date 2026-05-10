import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const PARIS_ID = '11111111-1111-4111-8111-111111111111';
  const TOKYO_ID = '22222222-2222-4222-8222-222222222222';
  const NYC_ID   = '33333333-3333-4333-8333-333333333333';
  const ROME_ID  = '44444444-4444-4444-8444-444444444444';

  // --- CITIES ---
  const cities = [
    {
      id: PARIS_ID,
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      image_url: 'https://images.unsplash.com/photo-1502602881469-4478d9001d6e',
      lat: 48.8566,
      lng: 2.3522,
      popularity_score: 100,
    },
    {
      id: TOKYO_ID,
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
      lat: 35.6762,
      lng: 139.6503,
      popularity_score: 95,
    },
    {
      id: NYC_ID,
      name: 'New York City',
      country: 'USA',
      region: 'North America',
      image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
      lat: 40.7128,
      lng: -74.0060,
      popularity_score: 98,
    },
    {
      id: ROME_ID,
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
      lat: 41.9028,
      lng: 12.4964,
      popularity_score: 90,
    }
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: city,
      create: city,
    });
  }

  // --- ACTIVITIES ---
  const activities = [
    // Paris Activities
    {
      id: 'a1111111-1111-4111-8111-111111111111',
      city_id: PARIS_ID,
      name: 'Eiffel Tower Visit',
      description: 'Climb or take the elevator up the iconic iron lady of Paris.',
      type: 'SIGHTSEEING',
      duration_hours: 2.0,
      estimated_cost: 25.0,
      image_url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f',
    },
    {
      id: 'b1111111-1111-4111-8111-111111111111',
      city_id: PARIS_ID,
      name: 'Louvre Museum',
      description: 'Home to the Mona Lisa and thousands of other masterpieces.',
      type: 'CULTURE',
      duration_hours: 4.0,
      estimated_cost: 17.0,
      image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a',
    },
    // Tokyo Activities
    {
      id: 'a2222222-2222-4222-8222-222222222222',
      city_id: TOKYO_ID,
      name: 'Senso-ji Temple',
      description: 'Tokyo’s oldest temple, located in Asakusa.',
      type: 'CULTURE',
      duration_hours: 1.5,
      estimated_cost: 0.0,
      image_url: 'https://images.unsplash.com/photo-1590559899731-a382839cecdf',
    },
    {
      id: 'b2222222-2222-4222-8222-222222222222',
      city_id: TOKYO_ID,
      name: 'Sushi Making Class',
      description: 'Learn to make authentic Edo-style sushi.',
      type: 'FOOD',
      duration_hours: 3.0,
      estimated_cost: 80.0,
      image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754',
    },
    // NYC Activities
    {
      id: 'a3333333-3333-4333-8333-333333333333',
      city_id: NYC_ID,
      name: 'Central Park Stroll',
      description: 'Walk, bike or relax in the massive green heart of Manhattan.',
      type: 'SIGHTSEEING',
      duration_hours: 2.0,
      estimated_cost: 0.0,
      image_url: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a',
    },
    // Rome Activities
    {
      id: 'a4444444-4444-4444-8444-444444444444',
      city_id: ROME_ID,
      name: 'Colosseum Tour',
      description: 'Explore the ancient gladiatorial arena.',
      type: 'SIGHTSEEING',
      duration_hours: 2.5,
      estimated_cost: 30.0,
      image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
    }
  ];

  for (const activity of activities) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: activity as any,
      create: activity as any,
    });
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    throw e;
  });
