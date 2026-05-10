import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { CollaborationIndicator } from '../components/CollaborationIndicator';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin, Plus, Clock, DollarSign, Users, Share2, Edit, Trash2, GripVertical, Loader2, Sparkles, Globe, Lock, Package } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

interface Activity {
  id: string;
  name: string;
  type: string;
  description: string;
  image_url: string | null;
  estimated_cost: number | null;
  duration_hours: number | null;
}

interface StopActivity {
  id: string;
  scheduled_time: string | null;
  notes: string | null;
  activity: Activity;
}

interface Stop {
  id: string;
  arrival_date: string | null;
  departure_date: string | null;
  order_index: number;
  notes: string | null;
  city: {
    id: string;
    name: string;
    country: string;
  };
  stop_activities: StopActivity[];
}

interface Trip {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  cover_photo_url: string | null;
  stops: Stop[];
}

function DraggableActivity({ stopActivity, index, moveActivity, onDelete }: any) {
  const [{ isDragging }, drag] = useDrag({
    type: 'activity',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'activity',
    hover: (item: any) => {
      if (item.index !== index) {
        moveActivity(item.index, index);
        item.index = index;
      }
    },
  });

  const activity = stopActivity.activity;
  const timeStr = stopActivity.scheduled_time 
    ? new Date(stopActivity.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : 'Not set';

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <GlassCard className="p-4 mb-3 cursor-move hover:bg-white/10 transition-all">
        <div className="flex items-start gap-4">
          <GripVertical className="w-5 h-5 text-muted-foreground mt-1" />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold mb-1">{activity.name}</h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {timeStr}
                  </div>
                  {activity.duration_hours && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {activity.duration_hours}h
                    </div>
                  )}
                  {activity.estimated_cost && (
                    <div className="flex items-center gap-1 text-accent">
                      <DollarSign className="w-4 h-4" />
                      {activity.estimated_cost}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDelete(stopActivity.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs rounded-full capitalize">
              {activity.type}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export function ItineraryBuilder() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [isNearbyLoading, setIsNearbyLoading] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const VADODARA_GEMS = [
    { name: "Laxmi Vilas Palace", lat: 22.2775, lng: 73.1897 },
    { name: "S-Cube Waterpark", lat: 22.3111, lng: 73.2472 },
    { name: "Khanderao Market", lat: 22.2933, lng: 73.1986 },
    { name: "Sayaji Baug Zoo", lat: 22.3115, lng: 73.1900 },
    { name: "Maharaja Fatehsinh Museum", lat: 22.2921, lng: 73.1938 },
    { name: "EME Temple", lat: 22.3315, lng: 73.1918 },
    { name: "Tambekar Wada", lat: 22.3028, lng: 73.1970 },
    { name: "Kirti Stambh", lat: 22.2958, lng: 73.1977 },
    { name: "Tapovan Temple", lat: 22.3444, lng: 73.2194 },
    { name: "Nimeta Garden", lat: 22.3556, lng: 73.2417 },
    { name: "Ajwa Garden", lat: 22.3750, lng: 73.2292 },
    { name: "Sindhrot Check Dam", lat: 22.2667, lng: 73.0917 },
  ];

  const fetchTrip = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/trips/${id}`);
      setTrip(data);
    } catch (err) {
      console.error('Failed to fetch trip:', err);
      toast.error('Failed to load itinerary.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchNearby = async (stop: Stop) => {
    try {
      setSelectedStopId(stop.id);
      setIsNearbyLoading(true);
      const { data } = await api.get(`/maps/nearby?location=${encodeURIComponent(stop.city.name)}&type=tourist_attraction`);
      setNearbyPlaces(data);
      toast.success(`Found ${data.length} places near ${stop.city.name}`);
    } catch (err) {
      console.error("Nearby Fetch Error:", err);
      toast.error("Failed to fetch nearby places");
    } finally {
      setIsNearbyLoading(false);
    }
  };

  const handleAiSuggest = async () => {
    if (!trip) return;
    try {
      setIsAiLoading(true);
      const destination = trip.stops[0]?.city?.name || trip.name;
      const days = trip.stops.length || 3;
      
      const { data } = await api.post('/ai/suggest', {
        destination,
        days,
        preferences: "Fun, historical sites, and great food"
      });
      
      setAiSuggestions(data);
      toast.success("AI has generated some suggestions for you!");
    } catch (err) {
      console.error("AI Suggest Error:", err);
      toast.error("Failed to get AI suggestions");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const moveActivity = (stopIndex: number, fromIndex: number, toIndex: number) => {
    if (!trip) return;
    const newStops = [...trip.stops];
    const [removed] = newStops[stopIndex].stop_activities.splice(fromIndex, 1);
    newStops[stopIndex].stop_activities.splice(toIndex, 0, removed);
    setTrip({ ...trip, stops: newStops });
    // In a real app, you'd sync this with the backend
  };

  const handleDeleteActivity = async (stopId: string, stopActivityId: string) => {
    try {
      await api.delete(`/stops/${stopId}/activities/${stopActivityId}`);
      toast.success('Activity removed');
      fetchTrip(); // Refresh
    } catch (err) {
      toast.error('Failed to delete activity');
    }
  };

  const collaborators = [
    { name: 'You', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', color: '#4F46E5' },
    { name: 'Sarah', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', color: '#06B6D4' },
    { name: 'Mike', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', color: '#F97316' },
  ];

  const toggleVisibility = async () => {
    if (!trip) return;
    try {
      const newStatus = !trip.is_public;
      await api.put(`/trips/${id}`, { is_public: newStatus });
      setTrip({ ...trip, is_public: newStatus });
      toast.success(newStatus ? "Trip is now Public!" : "Trip is now Private");
    } catch (err) {
      toast.error("Failed to update visibility");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) return null;

  const startDateStr = trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set';
  const endDateStr = trip.end_date ? new Date(trip.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const mapCenter = {
    lat: 22.3072, // Default to Vadodara/Gujarat area if no stops
    lng: 73.1812
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen">
        <Navbar />
        <Sidebar />

        <main className="ml-64 px-8 pb-8 pt-28">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{trip.name}</h1>
                  <button 
                    onClick={toggleVisibility}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                      trip.is_public 
                        ? 'bg-primary/10 text-primary border-primary/20' 
                        : 'bg-muted/10 text-muted-foreground border-muted/20'
                    }`}
                  >
                    {trip.is_public ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {trip.is_public ? 'Public' : 'Private'}
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground">{startDateStr} {endDateStr && ` - ${endDateStr}`}</p>
                  <CollaborationIndicator users={collaborators} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleAiSuggest}
                  disabled={isAiLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-accent to-primary px-4 py-2 rounded-xl text-white hover:opacity-90 transition-all disabled:opacity-70"
                >
                  {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  AI Suggest
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-white/5 transition-all">
                  <Users className="w-5 h-5" />
                  Invite
                </button>
                <button className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-2 rounded-xl text-white hover:opacity-90 transition-all">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {trip.stops.map((stop, stopIndex) => (
                  <div key={stop.id}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">{stop.city.name}</h2>
                        <button 
                          onClick={() => handleFetchNearby(stop)}
                          className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all text-muted-foreground hover:text-foreground"
                        >
                          <MapPin className="w-3 h-3" />
                          Explore Nearby
                        </button>
                      </div>
                      <span className="text-muted-foreground">
                        {stop.arrival_date ? new Date(stop.arrival_date).toLocaleDateString() : `Stop ${stopIndex + 1}`}
                      </span>
                    </div>

                    {selectedStopId === stop.id && nearbyPlaces.length > 0 && (
                      <div className="mb-6 animate-in slide-in-from-left duration-300">
                        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-accent" />
                          Popular Nearby {stop.city.name}
                        </h4>
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                          {nearbyPlaces.map((place) => (
                            <GlassCard key={place.id} className="min-w-[200px] p-0 overflow-hidden group">
                              <div className="h-24 relative">
                                <img src={place.image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200'} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                                  ★ {place.rating || 'N/A'}
                                </div>
                              </div>
                              <div className="p-3">
                                <h5 className="font-bold text-xs truncate mb-1">{place.name}</h5>
                                <p className="text-[10px] text-muted-foreground truncate">{place.address}</p>
                              </div>
                            </GlassCard>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      {stop.stop_activities.length > 0 ? (
                        stop.stop_activities.map((sa, actIndex) => (
                          <DraggableActivity
                            key={sa.id}
                            stopActivity={sa}
                            index={actIndex}
                            moveActivity={(from: number, to: number) => moveActivity(stopIndex, from, to)}
                            onDelete={(id: string) => handleDeleteActivity(stop.id, id)}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No activities planned for this stop yet.</p>
                      )}
                    </div>

                    <button className="w-full border-2 border-dashed border-border rounded-xl py-4 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                      <Plus className="w-5 h-5" />
                      Add Activity
                    </button>
                  </div>
                ))}

                {trip.stops.length === 0 && (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-muted-foreground">No cities added to this trip yet.</p>
                  </div>
                )}

                <button className="w-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl py-4 hover:opacity-80 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Destination
                </button>
              </div>

              <div className="space-y-6">
                <GlassCard className="overflow-hidden p-0 border-0 h-64">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={mapCenter}
                      zoom={11}
                      options={{
                        disableDefaultUI: true,
                        styles: [
                          {
                            "elementType": "geometry",
                            "stylers": [{ "color": "#242f3e" }]
                          },
                          {
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#746855" }]
                          },
                          {
                            "elementType": "labels.text.stroke",
                            "stylers": [{ "color": "#242f3e" }]
                          },
                          {
                            "featureType": "administrative.locality",
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#d59563" }]
                          },
                          {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [{ "color": "#17263c" }]
                          }
                        ]
                      }}
                    >
                      <Marker position={mapCenter} />
                      {VADODARA_GEMS.map((gem, idx) => (
                        <Marker 
                          key={idx} 
                          position={{ lat: gem.lat, lng: gem.lng }} 
                          title={gem.name}
                          icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                          }}
                        />
                      ))}
                    </GoogleMap>
                  ) : (
                    <div className="h-full bg-muted flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  )}
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4">Trip Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Cities</span>
                      <span className="font-bold">{trip.stops.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Activities</span>
                      <span className="font-bold">
                        {trip.stops.reduce((sum, s) => sum + s.stop_activities.length, 0)}
                      </span>
                    </div>
                    
                    <div className="pt-4 border-t border-border space-y-2">
                      <Link 
                        to={`/packing/${id}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Packing Checklist</span>
                        </div>
                        <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                      <Link 
                        to={`/budget/${id}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-accent/5 hover:bg-accent/10 transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium">Budget & Analytics</span>
                        </div>
                        <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Insights
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Gemini AI is ready to help you plan. Click the AI Suggest button for custom tips!</p>
                </GlassCard>

                {aiSuggestions && (
                  <GlassCard className="p-6 border-accent/30 bg-accent/5">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent" />
                      Gemini Recommendations
                    </h3>
                    <div className="space-y-4">
                      {aiSuggestions.itinerary?.map((day: any) => (
                        <div key={day.day} className="border-l-2 border-accent/20 pl-4 py-1">
                          <h4 className="font-bold text-sm text-accent mb-2">Day {day.day}</h4>
                          <div className="space-y-2">
                            {day.activities.map((act: any, i: number) => (
                              <div key={i} className="text-sm">
                                <span className="font-medium">{act.name}</span>
                                <p className="text-xs text-muted-foreground">{act.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {aiSuggestions.tips && (
                      <div className="mt-6 pt-6 border-t border-accent/20">
                        <h4 className="font-bold text-sm mb-2">Pro Tips</h4>
                        <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                          {aiSuggestions.tips.map((tip: string, i: number) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </GlassCard>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  );
}
