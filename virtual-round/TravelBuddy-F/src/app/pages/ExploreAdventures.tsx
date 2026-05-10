import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { api } from '../../lib/api';
import { MapPin, Users, Calendar, ArrowRight, Loader2, Heart, MessageSquare, Share2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

interface PublicTrip {
  id: string;
  name: string;
  description: string;
  cover_photo_url: string;
  start_date: string;
  end_date: string;
  user: {
    id: string;
    name: string;
    avatar_url: string;
    location: string;
    bio: string;
  };
  _count: {
    stops: number;
  };
}

export function ExploreAdventures() {
  const [trips, setTrips] = useState<PublicTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState<string | null>(null);

  const handleJoinTrip = async (tripId: string) => {
    try {
      setIsJoining(tripId);
      const { data } = await api.post(`/trips/${tripId}/join`);
      toast.success('Trip joined! You can now find it in your dashboard.');
      navigate(`/itinerary/${data.id}`);
    } catch (err) {
      console.error('Failed to join trip:', err);
      toast.error('Failed to join trip. Please try again.');
    } finally {
      setIsJoining(null);
    }
  };

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get('/trips/explore');
        setTrips(data);
      } catch (err) {
        console.error('Failed to fetch explore:', err);
        toast.error('Failed to load adventures.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExplore();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="ml-64 px-8 pb-8 pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-bold mb-2">Community Trips</h1>
              <p className="text-muted-foreground">Find trip partners and discover new horizons from our global community</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 px-4 py-2 rounded-xl text-primary font-bold border border-primary/20">
                {trips.length} Active Trips
              </div>
              <button 
                onClick={() => navigate('/create-community-trip')}
                className="bg-gradient-to-r from-primary to-secondary px-6 py-2.5 rounded-xl text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Trip
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <GlassCard key={trip.id} className="group overflow-hidden flex flex-col hover:border-primary/50 transition-all duration-500">
                  {/* Trip Cover */}
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={trip.cover_photo_url || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800`} 
                      alt={trip.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        {trip._count.stops} Cities Planned
                      </div>
                    </div>
                  </div>

                  {/* Traveler Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={trip.user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${trip.user.name}`} 
                        className="w-12 h-12 rounded-full border-2 border-primary/30"
                        alt={trip.user.name}
                      />
                      <div>
                        <h3 className="font-bold leading-tight">{trip.user.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {trip.user.location || 'Globe Trotter'}
                        </p>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{trip.name}</h2>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2 italic">
                      "{trip.user.bio || 'Ready for a new adventure!'}"
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'TBD'}
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleJoinTrip(trip.id)}
                            disabled={isJoining === trip.id}
                            className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold hover:bg-primary hover:text-white transition-all text-xs flex items-center gap-2 disabled:opacity-50"
                          >
                            {isJoining === trip.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Users className="w-3 h-3" />}
                            Join Trip
                          </button>
                          <button 
                            onClick={() => navigate(`/itinerary/${trip.id}`)}
                            className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm"
                          >
                            View <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                            <Heart className="w-5 h-5" />
                            <span className="text-xs">12</span>
                          </button>
                          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-xs">4</span>
                          </button>
                        </div>
                        <button className="bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {trips.length === 0 && !isLoading && (
            <div className="text-center py-24">
              <Users className="w-20 h-20 mx-auto mb-6 text-muted-foreground opacity-20" />
              <h2 className="text-2xl font-bold mb-2">No public adventures yet</h2>
              <p className="text-muted-foreground">Be the first to share your trip with the world!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
