import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { CollaborationIndicator } from '../components/CollaborationIndicator';
import { FloatingGradient } from '../components/FloatingGradient';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin, Plus, Clock, DollarSign, Users, Share2, Edit, Trash2, GripVertical, Loader2, Sparkles, Globe, Lock, Package, Calendar, ArrowLeft, Navigation, Eye } from 'lucide-react';
import { motion } from 'motion/react';
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

  const typeColors: Record<string, string> = {
    SIGHTSEEING: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    FOOD: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    ADVENTURE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    CULTURE: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    NIGHTLIFE: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    OTHER: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <GlassCard className="p-4 mb-3 cursor-move hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group/card">
        <div className="flex items-start gap-3">
          <GripVertical className="w-4 h-4 text-muted-foreground/40 group-hover/card:text-muted-foreground mt-1 transition-colors" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold mb-1.5 text-sm">{activity.name}</h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" />
                    {timeStr}
                  </div>
                  {activity.duration_hours && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.duration_hours}h
                    </div>
                  )}
                  {activity.estimated_cost > 0 && (
                    <div className="flex items-center gap-1 text-accent font-medium">
                      <DollarSign className="w-3 h-3" />
                      {activity.estimated_cost}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => onDelete(stopActivity.id)}
                  className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className={`inline-block px-2.5 py-0.5 text-[10px] rounded-full capitalize font-medium border ${typeColors[activity.type?.toUpperCase()] || typeColors.OTHER}`}>
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
  
  const [isAddDestinationModalOpen, setIsAddDestinationModalOpen] = useState(false);
  const [newDestinationQuery, setNewDestinationQuery] = useState("");
  const [isAddingDestination, setIsAddingDestination] = useState(false);

  // IMPORTANT: All hooks must be called before any conditional returns
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

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

  const handleInvite = () => {
    const inviteLink = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard!");
  };

  const handleAddDestination = () => {
    setIsAddDestinationModalOpen(true);
  };

  const submitAddDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestinationQuery.trim()) return;

    try {
      setIsAddingDestination(true);
      // 1. Search for the city
      const { data: cities } = await api.get(`/cities?q=${encodeURIComponent(newDestinationQuery)}`);
      if (!cities || cities.length === 0) {
        toast.error(`Could not find city: ${newDestinationQuery}`);
        setIsAddingDestination(false);
        return;
      }

      // 2. Add the first matched city as a stop
      const cityId = cities[0].id;
      await api.post(`/trips/${id}/stops`, {
        city_id: cityId,
        arrival_date: new Date().toISOString(),
      });
      
      toast.success(`${cities[0].name} added to itinerary!`);
      setIsAddDestinationModalOpen(false);
      setNewDestinationQuery("");
      fetchTrip(); // Refresh the itinerary
    } catch (err) {
      console.error("Failed to add destination:", err);
      toast.error("Failed to add destination. Please try again.");
    } finally {
      setIsAddingDestination(false);
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

  const mapCenter = {
    lat: 22.3072, // Default to Vadodara/Gujarat area if no stops
    lng: 73.1812
  };

  const totalActivities = trip.stops.reduce((sum, s) => sum + s.stop_activities.length, 0);
  const coverImage = trip.cover_photo_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200';

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen">
        <Navbar />
        <Sidebar />
        <FloatingGradient />

        <main className="ml-64 pb-8 pt-20">
          {/* Hero Cover Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative h-64 overflow-hidden"
          >
            <img src={coverImage} alt={trip.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/10" />
            
            {/* Back Button */}
            <Link to="/dashboard" className="absolute top-6 left-8 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md text-white rounded-full text-sm hover:bg-black/60 transition-all">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>

            {/* Hero Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-6">
              <div className="max-w-7xl mx-auto flex items-end justify-between">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-white drop-shadow-lg">{trip.name}</h1>
                    <button 
                      onClick={toggleVisibility}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all border ${
                        trip.is_public 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                          : 'bg-white/10 text-white/70 border-white/20'
                      }`}
                    >
                      {trip.is_public ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {trip.is_public ? 'Public' : 'Private'}
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                      <Calendar className="w-4 h-4" />
                      {startDateStr}{endDateStr && ` — ${endDateStr}`}
                    </div>
                    <div className="h-4 w-px bg-white/30" />
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                      <MapPin className="w-4 h-4" /> {trip.stops.length} cities
                    </div>
                    <div className="h-4 w-px bg-white/30" />
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                      <Eye className="w-4 h-4" /> {totalActivities} activities
                    </div>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3">
                  <button 
                    onClick={handleAiSuggest}
                    disabled={isAiLoading}
                    className="flex items-center gap-2 bg-gradient-to-r from-accent to-primary px-5 py-2.5 rounded-xl text-white hover:opacity-90 transition-all disabled:opacity-70 shadow-lg shadow-primary/20 text-sm font-medium"
                  >
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    AI Suggest
                  </button>
                  <button 
                    onClick={handleInvite}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all text-sm font-medium"
                  >
                    <Users className="w-4 h-4" /> Invite
                  </button>
                  <button className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-5 py-2.5 rounded-xl text-white hover:opacity-90 transition-all shadow-lg shadow-primary/20 text-sm font-medium">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Collaborators Bar */}
          <div className="px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center justify-between py-4 border-b border-border mb-8">
                <CollaborationIndicator users={collaborators} />
                {trip.description && <p className="text-sm text-muted-foreground max-w-md truncate">{trip.description}</p>}
              </motion.div>
            </div>
          </div>

          <div className="px-8">
          <div className="max-w-7xl mx-auto">

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-0">
                {trip.stops.map((stop, stopIndex) => (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + stopIndex * 0.15 }}
                    className="relative"
                  >
                    {/* Timeline connector */}
                    {stopIndex < trip.stops.length - 1 && (
                      <div className="absolute left-5 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-primary/10" />
                    )}

                    {/* Stop Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative z-10 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/30">
                          {stopIndex + 1}
                        </div>
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold">{stop.city.name}</h2>
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">{stop.city.country}</span>
                          <button 
                            onClick={() => handleFetchNearby(stop)}
                            className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full transition-all text-primary font-medium"
                          >
                            <Navigation className="w-3 h-3" />
                            Explore Nearby
                          </button>
                        </div>
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {stop.arrival_date ? new Date(stop.arrival_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Stop ${stopIndex + 1}`}
                        </span>
                      </div>
                    </div>

                    {/* Nearby Places */}
                    {selectedStopId === stop.id && nearbyPlaces.length > 0 && (
                      <div className="ml-14 mb-6 animate-in slide-in-from-left duration-300">
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

                    {/* Activities */}
                    <div className="ml-14 mb-4">
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
                        <GlassCard className="p-6 text-center border-dashed">
                          <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="text-sm text-muted-foreground">No activities planned for this stop yet.</p>
                        </GlassCard>
                      )}
                    </div>

                    <button className="ml-14 w-[calc(100%-3.5rem)] border-2 border-dashed border-border rounded-xl py-3 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-primary text-sm mb-8">
                      <Plus className="w-4 h-4" />
                      Add Activity
                    </button>
                  </motion.div>
                ))}

                {trip.stops.length === 0 && (
                  <GlassCard className="p-12 text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-bold mb-2">No destinations yet</h3>
                    <p className="text-muted-foreground mb-6">Start building your itinerary by adding your first destination.</p>
                  </GlassCard>
                )}

                <motion.button
                  onClick={handleAddDestination}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="w-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl py-5 hover:from-primary/20 hover:to-secondary/20 transition-all flex items-center justify-center gap-2 text-sm font-medium group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Add Destination
                </motion.button>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-6">
                {/* Map Card */}
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur-sm opacity-60" />
                  <GlassCard className="relative overflow-hidden p-0 border-0 h-72">
                    {isLoaded ? (
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={mapCenter}
                        zoom={11}
                        options={{
                          disableDefaultUI: true,
                          styles: [
                            { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
                            { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
                            { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
                            { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
                            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
                          ]
                        }}
                      >
                        <Marker position={mapCenter} />
                        {VADODARA_GEMS.map((gem, idx) => (
                          <Marker key={idx} position={{ lat: gem.lat, lng: gem.lng }} title={gem.name}
                            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                          />
                        ))}
                      </GoogleMap>
                    ) : (
                      <div className="h-full bg-muted flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    )}
                  </GlassCard>
                </div>

                {/* Trip Summary */}
                <GlassCard className="p-6">
                  <h3 className="font-bold mb-5 flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-gradient-to-b from-primary to-secondary rounded-full" />
                    Trip Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-primary/10 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-primary">{trip.stops.length}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Cities</div>
                    </div>
                    <div className="bg-secondary/10 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-secondary">{totalActivities}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Activities</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link 
                      to={`/packing/${id}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Package className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">Packing Checklist</span>
                      </div>
                      <span className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </Link>
                    <Link 
                      to={`/budget/${id}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-accent/5 hover:bg-accent/10 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-sm font-medium">Budget & Analytics</span>
                      </div>
                      <span className="text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </Link>
                  </div>
                </GlassCard>

                {/* AI Insights */}
                <GlassCard className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">AI Insights</h3>
                      <p className="text-xs text-muted-foreground">Gemini AI is ready to help you plan. Click the AI Suggest button for personalized tips!</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAiSuggest}
                    disabled={isAiLoading}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60"
                  >
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Get AI Suggestions
                  </button>
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
              </motion.div>
            </div>
          </div>
          </div>
        </main>
      </div>

      {/* Add Destination Modal */}
      {isAddDestinationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-2">Add a Destination</h3>
              <p className="text-sm text-muted-foreground mb-6">Search for a city to add to your itinerary.</p>
              
              <form onSubmit={submitAddDestination}>
                <input
                  type="text"
                  placeholder="e.g., Vadodara, Paris, Tokyo"
                  value={newDestinationQuery}
                  onChange={(e) => setNewDestinationQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary mb-6"
                  autoFocus
                />
                
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddDestinationModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingDestination || !newDestinationQuery.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-5 py-2 rounded-xl text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isAddingDestination ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Stop
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </DndProvider>
  );
}
