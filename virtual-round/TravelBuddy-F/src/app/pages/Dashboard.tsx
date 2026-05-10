import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { useUser } from '../../context/UserContext';
import { api } from '../../lib/api';
import { PlusCircle, MapPin, DollarSign, Calendar, TrendingUp, Sparkles, Users, Clock, Loader2, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { AIAssistantModal } from '../components/AIAssistantModal';

interface Trip {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  cover_photo_url: string | null;
  total_budget: number | null;
}

export function Dashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedAIDestination, setSelectedAIDestination] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await api.get('/trips');
        setTrips(data);
      } catch (err) {
        console.error('Failed to fetch trips:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const firstName = user.name ? user.name.split(' ')[0] : 'Traveler';

  const popularDestinations = [
    { name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400' },
    { name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
    { name: 'Iceland', country: 'Reykjavik', image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=400' },
    { name: 'Morocco', country: 'Marrakech', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="ml-64 px-8 pb-8 pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="pl-1">
              <h1 className="text-4xl font-bold mb-2">Welcome back, {firstName}!</h1>
              <p className="text-muted-foreground">Ready to plan your next adventure?</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedAIDestination(undefined);
                  setIsAIModalOpen(true);
                }}
                className="flex items-center gap-2 bg-white/50 dark:bg-black/20 backdrop-blur-xl border border-primary/20 px-6 py-3 rounded-xl hover:bg-primary/5 transition-all group"
              >
                <Sparkles className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-medium">AI Assistant</span>
              </button>
              <Link
                to="/create-trip"
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                <PlusCircle className="w-5 h-5" />
                New Trip
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary/20 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{trips.length}</div>
              <div className="text-sm text-muted-foreground">Total Trips</div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-secondary/20 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-secondary" />
                </div>
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {trips.filter(t => t.start_date && new Date(t.start_date) > new Date()).length}
              </div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-accent/20 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">
                ${trips.reduce((sum, t) => sum + (t.total_budget || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">0</div>
              <div className="text-sm text-muted-foreground">Travel Buddies</div>
            </GlassCard>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Trips</h2>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : trips.length === 0 ? (
                <GlassCard className="p-12 text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-xl font-bold mb-2">No trips yet!</h3>
                  <p className="text-muted-foreground mb-6">Create your first trip to start planning your adventure.</p>
                  <Link
                    to="/create-trip"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white hover:opacity-90 transition-all"
                  >
                    <PlusCircle className="w-5 h-5" /> Create a Trip
                  </Link>
                </GlassCard>
              ) : (
                <div className="space-y-4">
                  {trips.map((trip, index) => (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                        <GlassCard hover className="p-6 overflow-hidden relative group">
                          <div className="flex gap-6">
                            <Link to={`/itinerary/${trip.id}`} className="shrink-0">
                              <img
                                src={trip.cover_photo_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                                alt={trip.name}
                                className="w-32 h-32 rounded-xl object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </Link>
                            <div className="flex-1 flex flex-col">
                              <div className="flex items-start justify-between mb-3">
                                <Link to={`/itinerary/${trip.id}`} className="hover:text-primary transition-colors">
                                  <h3 className="text-xl font-bold mb-1">{trip.name}</h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    {trip.start_date ? formatDate(trip.start_date) : 'Dates not set'}
                                    {trip.end_date && ` → ${formatDate(trip.end_date)}`}
                                  </div>
                                </Link>
                                {trip.total_budget && (
                                  <div className="text-right">
                                    <div className="text-sm text-muted-foreground mb-1">Budget</div>
                                    <div className="text-lg font-bold text-accent">${trip.total_budget.toLocaleString()}</div>
                                  </div>
                                )}
                              </div>
                              {trip.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">{trip.description}</p>
                              )}
                              
                              <div className="flex items-center gap-2 mt-auto">
                                <Link 
                                  to={`/itinerary/${trip.id}`}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-all"
                                >
                                  View Itinerary
                                </Link>
                                <Link 
                                  to={`/packing/${trip.id}`}
                                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary font-bold hover:bg-secondary/20 transition-all"
                                >
                                  <Package className="w-3 h-3" />
                                  Packing
                                </Link>
                                <Link 
                                  to={`/budget/${trip.id}`}
                                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-accent/10 text-accent font-bold hover:bg-accent/20 transition-all"
                                >
                                  <DollarSign className="w-3 h-3" />
                                  Budget
                                </Link>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">AI Suggestions</h2>
              <GlassCard className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 hover:shadow-lg transition-all cursor-pointer" onClick={() => {
                const dest = trips.length > 0 ? trips[0].name.replace(' Trip', '').replace(' (Joined)', '') : 'Paris';
                setSelectedAIDestination(dest);
                setIsAIModalOpen(true);
              }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">
                      Perfect Time to Visit {trips.length > 0 ? trips[0].name.replace(' Trip', '') : 'Paris'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {trips.length > 0 
                        ? `Based on your upcoming plans for ${trips[0].name}, we recommend checking local weather and packing accordingly. Want a full AI itinerary?`
                        : `Based on your preferences, spring offers great weather and lower prices for Paris.`
                      }
                    </p>
                    <button className="text-sm text-primary hover:underline font-medium">Plan with AI →</button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Explore Destinations</h2>
              <Link to="/activities" className="text-primary hover:underline text-sm">View all</Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {popularDestinations.map((dest, index) => (
                <GlassCard key={index} hover className="overflow-hidden group">
                  <div className="relative h-48">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold mb-1">{dest.name}</h3>
                      <p className="text-sm text-gray-300">{dest.country}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </main>
      <AIAssistantModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        initialDestination={selectedAIDestination}
      />
    </div>
  );
}
