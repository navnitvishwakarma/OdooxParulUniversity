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

  // --- DEMO USERS for Community Trips ---
  const demoUsers = [
    {
      id: 'dd111111-1111-4111-8111-111111111111',
      name: 'Aarav Sharma',
      email: 'aarav@demo.travel',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      location: 'Mumbai, India',
      bio: 'Adventure seeker & foodie. 23 countries and counting!',
    },
    {
      id: 'dd222222-2222-4222-8222-222222222222',
      name: 'Priya Patel',
      email: 'priya@demo.travel',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      location: 'Ahmedabad, India',
      bio: 'Solo traveler. Love sunsets, street food & hidden gems.',
    },
    {
      id: 'dd333333-3333-4333-8333-333333333333',
      name: 'Ravi Verma',
      email: 'ravi@demo.travel',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      location: 'Bangalore, India',
      bio: 'Tech nomad. Working remotely from beaches worldwide.',
    },
    {
      id: 'dd444444-4444-4444-8444-444444444444',
      name: 'Ananya Singh',
      email: 'ananya@demo.travel',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      location: 'Delhi, India',
      bio: 'History lover & culture explorer. Let\u2019s travel together!',
    },
  ];

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }

  // --- EXTRA CITIES for richer trips ---
  const extraCities = [
    { id: '55555555-5555-4555-8555-555555555555', name: 'Bali', country: 'Indonesia', region: 'Asia', image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4', lat: -8.3405, lng: 115.0920, popularity_score: 92 },
    { id: '66666666-6666-4666-8666-666666666666', name: 'Barcelona', country: 'Spain', region: 'Europe', image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded', lat: 41.3874, lng: 2.1686, popularity_score: 88 },
    { id: '77777777-7777-4777-8777-777777777777', name: 'Kyoto', country: 'Japan', region: 'Asia', image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', lat: 35.0116, lng: 135.7681, popularity_score: 85 },
    { id: '88888888-8888-4888-8888-888888888888', name: 'Santorini', country: 'Greece', region: 'Europe', image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff', lat: 36.3932, lng: 25.4615, popularity_score: 91 },
    { id: '99999999-9999-4999-8999-999999999999', name: 'Dubai', country: 'UAE', region: 'Middle East', image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', lat: 25.2048, lng: 55.2708, popularity_score: 93 },
    { id: 'aabbccdd-1111-4111-8111-aabbccdd1111', name: 'Manali', country: 'India', region: 'Asia', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23', lat: 32.2432, lng: 77.1892, popularity_score: 80 },
  ];

  for (const city of extraCities) {
    await prisma.city.upsert({ where: { id: city.id }, update: city, create: city });
  }

  // --- EXTRA ACTIVITIES ---
  const extraActivities = [
    { id: 'ea111111-1111-4111-8111-111111111111', city_id: '55555555-5555-4555-8555-555555555555', name: 'Ubud Rice Terraces Trek', type: 'ADVENTURE', description: 'Walk through stunning Tegallalang rice paddies.', duration_hours: 3.0, estimated_cost: 15.0 },
    { id: 'ea222222-2222-4222-8222-222222222222', city_id: '55555555-5555-4555-8555-555555555555', name: 'Uluwatu Sunset & Kecak Dance', type: 'CULTURE', description: 'Watch the sunset from the cliff temple with a fire dance show.', duration_hours: 2.5, estimated_cost: 10.0 },
    { id: 'ea333333-3333-4333-8333-333333333333', city_id: '66666666-6666-4666-8666-666666666666', name: 'Sagrada Familia Tour', type: 'SIGHTSEEING', description: 'Gaudi\u2019s unfinished masterpiece basilica.', duration_hours: 2.0, estimated_cost: 26.0 },
    { id: 'ea444444-4444-4444-8444-444444444444', city_id: '66666666-6666-4666-8666-666666666666', name: 'La Boqueria Market Food Walk', type: 'FOOD', description: 'Taste fresh seafood, tapas, and local juices.', duration_hours: 1.5, estimated_cost: 20.0 },
    { id: 'ea555555-5555-4555-8555-555555555555', city_id: '77777777-7777-4777-8777-777777777777', name: 'Fushimi Inari Shrine Hike', type: 'SIGHTSEEING', description: 'Walk through thousands of vermilion torii gates.', duration_hours: 2.5, estimated_cost: 0.0 },
    { id: 'ea666666-6666-4666-8666-666666666666', city_id: '88888888-8888-4888-8888-888888888888', name: 'Oia Sunset Cruise', type: 'ADVENTURE', description: 'Catamaran cruise around the caldera with dinner.', duration_hours: 4.0, estimated_cost: 120.0 },
    { id: 'ea777777-7777-4777-8777-777777777777', city_id: '99999999-9999-4999-8999-999999999999', name: 'Desert Safari & Dune Bashing', type: 'ADVENTURE', description: 'Thrilling 4x4 ride through golden sand dunes.', duration_hours: 5.0, estimated_cost: 60.0 },
    { id: 'ea888888-8888-4888-8888-888888888888', city_id: 'aabbccdd-1111-4111-8111-aabbccdd1111', name: 'Rohtang Pass Expedition', type: 'ADVENTURE', description: 'Drive through the snow-capped mountain pass.', duration_hours: 6.0, estimated_cost: 35.0 },
    { id: 'ea999999-9999-4999-8999-999999999999', city_id: 'aabbccdd-1111-4111-8111-aabbccdd1111', name: 'Old Manali Café Hopping', type: 'FOOD', description: 'Chill at hipster cafés in the Old Manali village.', duration_hours: 2.0, estimated_cost: 10.0 },
  ];

  for (const act of extraActivities) {
    await prisma.activity.upsert({ where: { id: act.id }, update: act as any, create: act as any });
  }

  // --- COMMUNITY TRIPS (Public) ---
  const communityTrips = [
    {
      id: 'c1111111-1111-4111-8111-111111111111',
      user_id: demoUsers[0].id,
      name: 'Bali Backpacking — 7 Days of Paradise',
      description: 'Looking for 3-4 chill travelers to explore Bali on a budget. Surfing, rice terraces, temple tours & epic sunsets!',
      cover_photo_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      start_date: new Date('2026-06-15'),
      end_date: new Date('2026-06-22'),
      is_public: true,
      total_budget: 800,
    },
    {
      id: 'c1222222-2222-4222-8222-222222222222',
      user_id: demoUsers[1].id,
      name: 'Europe Highlights — Paris × Barcelona',
      description: 'Solo female traveler looking for a group! 10-day trip covering the best of Paris and Barcelona. Art, food, nightlife.',
      cover_photo_url: 'https://images.unsplash.com/photo-1502602881469-4478d9001d6e?w=800',
      start_date: new Date('2026-07-01'),
      end_date: new Date('2026-07-10'),
      is_public: true,
      total_budget: 2500,
    },
    {
      id: 'c1333333-3333-4333-8333-333333333333',
      user_id: demoUsers[2].id,
      name: 'Japan Golden Route — Tokyo to Kyoto',
      description: 'Tech & culture trip! Bullet trains, cherry blossoms, ramen hunts, and shrine walks. Digital nomads welcome!',
      cover_photo_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
      start_date: new Date('2026-08-10'),
      end_date: new Date('2026-08-20'),
      is_public: true,
      total_budget: 3000,
    },
    {
      id: 'c1444444-4444-4444-8444-444444444444',
      user_id: demoUsers[3].id,
      name: 'Santorini & Dubai Luxury Escape',
      description: 'A luxe 12-day journey from Greek islands to the glittering skyscrapers of Dubai. Yacht rides, desert safaris, and fine dining.',
      cover_photo_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
      start_date: new Date('2026-09-05'),
      end_date: new Date('2026-09-16'),
      is_public: true,
      total_budget: 5000,
    },
    {
      id: 'c1555555-5555-4555-8555-555555555555',
      user_id: demoUsers[0].id,
      name: 'Himalayan Adventure — Manali Explorer',
      description: 'Mountain lovers unite! Trekking, snow, river rafting, and bonfires. Budget-friendly trip for thrill seekers.',
      cover_photo_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
      start_date: new Date('2026-06-01'),
      end_date: new Date('2026-06-07'),
      is_public: true,
      total_budget: 500,
    },
    {
      id: 'c1666666-6666-4666-8666-666666666666',
      user_id: demoUsers[2].id,
      name: 'NYC × Rome — History Meets Hustle',
      description: 'Two iconic cities, one epic trip. Wall Street to Colosseum. Pizza in both continents. Who\u2019s in?',
      cover_photo_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      start_date: new Date('2026-10-01'),
      end_date: new Date('2026-10-14'),
      is_public: true,
      total_budget: 4000,
    },
  ];

  for (const trip of communityTrips) {
    await prisma.trip.upsert({ where: { id: trip.id }, update: trip as any, create: trip as any });
  }

  // --- STOPS for Community Trips ---
  const communityStops = [
    // Bali trip
    { id: 'c5111111-1111-4111-8111-111111111111', trip_id: communityTrips[0].id, city_id: '55555555-5555-4555-8555-555555555555', order_index: 0, arrival_date: new Date('2026-06-15'), departure_date: new Date('2026-06-22') },
    // Europe trip
    { id: 'c5222222-2222-4222-8222-222222222222', trip_id: communityTrips[1].id, city_id: PARIS_ID, order_index: 0, arrival_date: new Date('2026-07-01'), departure_date: new Date('2026-07-05') },
    { id: 'c5333333-3333-4333-8333-333333333333', trip_id: communityTrips[1].id, city_id: '66666666-6666-4666-8666-666666666666', order_index: 1, arrival_date: new Date('2026-07-06'), departure_date: new Date('2026-07-10') },
    // Japan trip
    { id: 'c5444444-4444-4444-8444-444444444444', trip_id: communityTrips[2].id, city_id: TOKYO_ID, order_index: 0, arrival_date: new Date('2026-08-10'), departure_date: new Date('2026-08-15') },
    { id: 'c5555555-5555-4555-8555-555555555555', trip_id: communityTrips[2].id, city_id: '77777777-7777-4777-8777-777777777777', order_index: 1, arrival_date: new Date('2026-08-16'), departure_date: new Date('2026-08-20') },
    // Santorini + Dubai trip
    { id: 'c5666666-6666-4666-8666-666666666666', trip_id: communityTrips[3].id, city_id: '88888888-8888-4888-8888-888888888888', order_index: 0, arrival_date: new Date('2026-09-05'), departure_date: new Date('2026-09-10') },
    { id: 'c5777777-7777-4777-8777-777777777777', trip_id: communityTrips[3].id, city_id: '99999999-9999-4999-8999-999999999999', order_index: 1, arrival_date: new Date('2026-09-11'), departure_date: new Date('2026-09-16') },
    // Manali trip
    { id: 'c5888888-8888-4888-8888-888888888888', trip_id: communityTrips[4].id, city_id: 'aabbccdd-1111-4111-8111-aabbccdd1111', order_index: 0, arrival_date: new Date('2026-06-01'), departure_date: new Date('2026-06-07') },
    // NYC + Rome trip
    { id: 'c5999999-9999-4999-8999-999999999999', trip_id: communityTrips[5].id, city_id: NYC_ID, order_index: 0, arrival_date: new Date('2026-10-01'), departure_date: new Date('2026-10-07') },
    { id: 'c5aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', trip_id: communityTrips[5].id, city_id: ROME_ID, order_index: 1, arrival_date: new Date('2026-10-08'), departure_date: new Date('2026-10-14') },
  ];

  for (const stop of communityStops) {
    await prisma.stop.upsert({ where: { id: stop.id }, update: stop as any, create: stop as any });
  }

  // --- STOP ACTIVITIES for Community Trips ---
  const communityStopActivities = [
    { id: '5a111111-1111-4111-8111-111111111111', stop_id: 'c5111111-1111-4111-8111-111111111111', activity_id: 'ea111111-1111-4111-8111-111111111111' },
    { id: '5a222222-2222-4222-8222-222222222222', stop_id: 'c5111111-1111-4111-8111-111111111111', activity_id: 'ea222222-2222-4222-8222-222222222222' },
    { id: '5a333333-3333-4333-8333-333333333333', stop_id: 'c5222222-2222-4222-8222-222222222222', activity_id: 'a1111111-1111-4111-8111-111111111111' },
    { id: '5a444444-4444-4444-8444-444444444444', stop_id: 'c5222222-2222-4222-8222-222222222222', activity_id: 'b1111111-1111-4111-8111-111111111111' },
    { id: '5a555555-5555-4555-8555-555555555555', stop_id: 'c5333333-3333-4333-8333-333333333333', activity_id: 'ea333333-3333-4333-8333-333333333333' },
    { id: '5a666666-6666-4666-8666-666666666666', stop_id: 'c5333333-3333-4333-8333-333333333333', activity_id: 'ea444444-4444-4444-8444-444444444444' },
    { id: '5a777777-7777-4777-8777-777777777777', stop_id: 'c5444444-4444-4444-8444-444444444444', activity_id: 'a2222222-2222-4222-8222-222222222222' },
    { id: '5a888888-8888-4888-8888-888888888888', stop_id: 'c5444444-4444-4444-8444-444444444444', activity_id: 'b2222222-2222-4222-8222-222222222222' },
    { id: '5a999999-9999-4999-8999-999999999999', stop_id: 'c5555555-5555-4555-8555-555555555555', activity_id: 'ea555555-5555-4555-8555-555555555555' },
    { id: '5aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', stop_id: 'c5666666-6666-4666-8666-666666666666', activity_id: 'ea666666-6666-4666-8666-666666666666' },
    { id: '5abbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', stop_id: 'c5777777-7777-4777-8777-777777777777', activity_id: 'ea777777-7777-4777-8777-777777777777' },
    { id: '5acccccc-cccc-4ccc-8ccc-cccccccccccc', stop_id: 'c5888888-8888-4888-8888-888888888888', activity_id: 'ea888888-8888-4888-8888-888888888888' },
    { id: '5adddddd-dddd-4ddd-8ddd-dddddddddddd', stop_id: 'c5888888-8888-4888-8888-888888888888', activity_id: 'ea999999-9999-4999-8999-999999999999' },
    { id: '5aeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', stop_id: 'c5999999-9999-4999-8999-999999999999', activity_id: 'a3333333-3333-4333-8333-333333333333' },
    { id: '5affffff-ffff-4fff-8fff-ffffffffffff', stop_id: 'c5aaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', activity_id: 'a4444444-4444-4444-8444-444444444444' },
  ];

  for (const sa of communityStopActivities) {
    await prisma.stopActivity.upsert({ where: { id: sa.id }, update: sa, create: sa });
  }

  console.log('Seeding finished. Added 4 demo users, 6 community trips, 10 stops, 15 activities.');
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
