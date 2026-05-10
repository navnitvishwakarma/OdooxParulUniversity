import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { Upload, Sparkles, Calendar, MapPin, FileText, Loader2 } from 'lucide-react';

export function CreateTrip() {
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
      });
      toast.success(`Trip "${data.name}" created!`);
      navigate(`/itinerary/${data.id}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create trip. Please try again.');
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create New Trip</h1>
            <p className="text-muted-foreground">Start planning your next adventure</p>
          </div>

          <GlassCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Trip Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Summer Adventure in Japan"
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
                    Start Date
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
                    End Date
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
                  Destination (for reference)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Tokyo, Japan"
                  value={tripData.destination}
                  onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Tell us about your trip plans, preferences, or any special requirements..."
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
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-4 rounded-xl text-white hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {isLoading ? 'Creating Trip...' : 'Create Trip'}
                  </button>
                </div>
              </div>
            </form>
          </GlassCard>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <GlassCard className="p-6 text-center">
              <div className="bg-primary/20 p-3 rounded-xl w-fit mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Smart Planning</h3>
              <p className="text-sm text-muted-foreground">Add stops and activities after creating your trip</p>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <div className="bg-secondary/20 p-3 rounded-xl w-fit mx-auto mb-3">
                <MapPin className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold mb-2">Multi-City</h3>
              <p className="text-sm text-muted-foreground">Plan trips across multiple destinations seamlessly</p>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <div className="bg-accent/20 p-3 rounded-xl w-fit mx-auto mb-3">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">Flexible</h3>
              <p className="text-sm text-muted-foreground">Easily adjust dates, activities, and destinations anytime</p>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
