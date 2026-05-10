import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import { api } from '../../lib/api';
import { MapPin, Calendar, DollarSign, Clock, Share2, Download, Heart, Loader2 } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  type: string;
}

interface StopActivity {
  id: string;
  scheduled_time: string | null;
  activity: Activity;
}

interface Stop {
  id: string;
  arrival_date: string | null;
  city: { name: string };
  stop_activities: StopActivity[];
}

interface Trip {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  cover_photo_url: string | null;
  total_budget: number | null;
  user: {
    name: string;
    avatar_url: string | null;
  };
  stops: Stop[];
}

export function PublicItinerary() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/trips/${id}`);
        setTrip(data);
      } catch (err) {
        console.error('Failed to fetch public trip:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div>
          <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <h1 className="text-2xl font-bold mb-2">Trip Not Found</h1>
          <p className="text-muted-foreground">This trip might be private or doesn't exist.</p>
        </div>
      </div>
    );
  }

  const startDateStr = trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set';
  const endDateStr = trip.end_date ? new Date(trip.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const durationDays = trip.start_date && trip.end_date 
    ? Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 3600 * 24)) + 1
    : 0;

  return (
    <div className="min-h-screen">
      <div className="relative h-96 overflow-hidden">
        <img
          src={trip.cover_photo_url || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200'}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">{trip.name}</h1>
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {startDateStr} {endDateStr && ` - ${endDateStr}`}
              </div>
              {durationDays > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {durationDays} days
                </div>
              )}
              {trip.total_budget && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  ${trip.total_budget.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <img
                  src={trip.user.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'}
                  alt={trip.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold">Created by {trip.user.name}</div>
                  <div className="text-sm text-muted-foreground">Shared public itinerary</div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {trip.stops.map((stop, index) => (
                <div key={stop.id}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-primary to-secondary w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{stop.city.name}</h2>
                      <p className="text-muted-foreground">
                        {stop.arrival_date ? new Date(stop.arrival_date).toLocaleDateString() : `Day ${index + 1}`}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 ml-16">
                    {stop.stop_activities.map((sa) => (
                      <GlassCard key={sa.id} className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="text-sm text-muted-foreground min-w-[80px]">
                            {sa.scheduled_time ? new Date(sa.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold mb-1">{sa.activity.name}</h3>
                            <div className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs rounded-full capitalize">
                              {sa.activity.type}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                    {stop.stop_activities.length === 0 && (
                      <p className="text-sm text-muted-foreground ml-4 italic">No activities listed.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6 sticky top-8">
              <h3 className="font-bold mb-4">Trip Overview</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Stops</span>
                  <span className="font-bold">{trip.stops.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Activities</span>
                  <span className="font-bold">
                    {trip.stops.reduce((sum, s) => sum + s.stop_activities.length, 0)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-primary to-secondary py-3 rounded-xl text-white hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Save Trip
                </button>
                <button className="w-full border border-border py-3 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button className="w-full border border-border py-3 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Export PDF
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
