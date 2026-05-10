import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { Users, Sparkles, Calendar, MapPin, FileText, Loader2, Globe } from 'lucide-react';

export function CreateCommunityTrip() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tripData, setTripData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripData.name.trim()) {
      toast.error('Please enter a trip name.');
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await api.post('/trips', {
        name: tripData.name,
        description: tripData.description,
        start_date: tripData.startDate || null,
        end_date: tripData.endDate || null,
        is_public: true, // Community trips are public by default
      });
      toast.success(`Community trip "${data.name}" created and shared!`);
      navigate(`/itinerary/${data.id}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create community trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="ml-64 px-8 pb-8 pt-28">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Users className="w-10 h-10 text-primary" />
                Create Community Trip
              </h1>
              <p className="text-muted-foreground">Share your upcoming journey and find travel partners from around the world</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl flex items-center gap-2 text-primary font-medium">
              <Globe className="w-4 h-4" />
              Publicly Shared
            </div>
          </div>

          <GlassCard className="p-8 border-primary/20 bg-primary/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Community Trip Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Backpacking across Southeast Asia - Summer 2024"
                  value={tripData.name}
                  onChange={(e) => setTripData({ ...tripData, name: e.target.value })}
                  required
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Target Start Date
                  </label>
                  <input
                    type="date"
                    value={tripData.startDate}
                    onChange={(e) => setTripData({ ...tripData, startDate: e.target.value })}
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Target End Date
                  </label>
                  <input
                    type="date"
                    value={tripData.endDate}
                    onChange={(e) => setTripData({ ...tripData, endDate: e.target.value })}
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Primary Destination
                </label>
                <input
                  type="text"
                  placeholder="e.g., Bali, Indonesia"
                  value={tripData.destination}
                  onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Community Pitch (Description)</label>
                <textarea
                  placeholder="Invite others to join you! Describe the vibe of the trip, who you're looking for, and your rough itinerary..."
                  value={tripData.description}
                  onChange={(e) => setTripData({ ...tripData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-4 rounded-xl text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {isLoading ? 'Launching Trip...' : 'Publish to Community'}
                  </button>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  By publishing, your trip will be visible to all members of the TravelBuddy community.
                </p>
              </div>
            </form>
          </GlassCard>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <GlassCard className="p-6 text-center hover:border-primary/30 transition-colors">
              <div className="bg-primary/20 p-3 rounded-xl w-fit mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Find Partners</h3>
              <p className="text-sm text-muted-foreground">Connect with travelers who share your interests and schedule</p>
            </GlassCard>
            <GlassCard className="p-6 text-center hover:border-secondary/30 transition-colors">
              <div className="bg-secondary/20 p-3 rounded-xl w-fit mx-auto mb-3">
                <Globe className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold mb-2">Go Global</h3>
              <p className="text-sm text-muted-foreground">Reach a worldwide audience of explorers and adventurers</p>
            </GlassCard>
            <GlassCard className="p-6 text-center hover:border-accent/30 transition-colors">
              <div className="bg-accent/20 p-3 rounded-xl w-fit mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">Shared Joy</h3>
              <p className="text-sm text-muted-foreground">Collaborate on itineraries and make lasting memories together</p>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
