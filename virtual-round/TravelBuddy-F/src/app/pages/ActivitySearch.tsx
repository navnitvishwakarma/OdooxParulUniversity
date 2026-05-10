import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { Search, Filter, Star, Clock, DollarSign, MapPin, Plus } from 'lucide-react';

export function ActivitySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Sightseeing', 'Food', 'Adventure', 'Culture', 'Nightlife', 'Nature'];

  const activities = [
    {
      id: 1,
      title: 'Laxmi Vilas Palace Tour',
      image: 'https://images.unsplash.com/photo-1590766940554-638c4b752945?w=600',
      rating: 4.9,
      reviews: 15432,
      duration: '2-3 hours',
      price: '$10',
      category: 'Sightseeing',
      location: 'J N Marg, Vadodara',
    },
    {
      id: 2,
      title: 'Authentic Gujarati Thali at Mandap',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600',
      rating: 4.8,
      reviews: 8234,
      duration: '1-2 hours',
      price: '$15',
      category: 'Food',
      location: 'Alkapuri, Vadodara',
    },
    {
      id: 3,
      title: 'Sayaji Baug Zoo & Gardens',
      image: 'https://images.unsplash.com/photo-1587324438673-56c80c2f6d0a?w=600',
      rating: 4.6,
      reviews: 12678,
      duration: '3-4 hours',
      price: 'Free',
      category: 'Nature',
      location: 'Kala Ghoda, Vadodara',
    },
    {
      id: 4,
      title: 'EME Temple Visit',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600',
      rating: 4.7,
      reviews: 5432,
      duration: '1 hour',
      price: 'Free',
      category: 'Culture',
      location: 'Fatehgunj, Vadodara',
    },
    {
      id: 5,
      title: 'Ratri Bazar Street Food Tour',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
      rating: 4.9,
      reviews: 9876,
      duration: '2-3 hours',
      price: '$10',
      category: 'Nightlife',
      location: 'Mangal Pandey Rd, Vadodara',
    },
    {
      id: 6,
      title: 'Maharaja Fatehsinh Museum',
      image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=600',
      rating: 4.8,
      reviews: 6234,
      duration: '2 hours',
      price: '$5',
      category: 'Culture',
      location: 'Palace Compound, Vadodara',
    },
    {
      id: 7,
      title: 'S-Cube Waterpark Adventure',
      image: 'https://images.unsplash.com/photo-1582046424056-db289945ccb6?w=600',
      rating: 4.5,
      reviews: 3421,
      duration: 'Full day',
      price: '$20',
      category: 'Adventure',
      location: 'Ajwa, Vadodara',
    },
    {
      id: 8,
      title: 'Sindhrot Check Dam Sunset',
      image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600',
      rating: 4.7,
      reviews: 4654,
      duration: '2 hours',
      price: 'Free',
      category: 'Nature',
      location: 'Sindhrot, Vadodara',
    },
  ];

  const filteredActivities =
    selectedCategory === 'All'
      ? activities
      : activities.filter((activity) => activity.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="ml-64 px-8 pb-8 pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Explore Activities</h1>
            <p className="text-muted-foreground">Discover amazing experiences for your trip</p>
          </div>

          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search activities, attractions, restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="w-5 h-5" />
                <span className="text-sm">Filter:</span>
              </div>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <GlassCard key={activity.id} hover className="overflow-hidden group flex flex-col">
                <div className="relative">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-white">{activity.rating}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white">
                      {activity.category}
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {activity.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm mb-4 mt-auto">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {activity.duration}
                    </div>
                    <div className="flex items-center gap-1 font-bold text-accent">
                      <DollarSign className="w-4 h-4" />
                      {activity.price}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mb-4">
                    {activity.reviews.toLocaleString()} reviews
                  </div>

                  <button className="w-full bg-gradient-to-r from-primary to-secondary py-3 rounded-xl text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-auto">
                    <Plus className="w-5 h-5" />
                    Add to Trip
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
