import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { Upload, Sparkles, Calendar, MapPin, FileText } from 'lucide-react';

export function CreateTrip() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/itinerary/1');
  };

  const handleAIGenerate = () => {
    navigate('/itinerary/1');
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
                  Trip Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Summer Adventure in Japan"
                  value={tripData.name}
                  onChange={(e) => setTripData({ ...tripData, name: e.target.value })}
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
                  Destination
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
                <label className="block text-sm mb-2">Cover Image</label>
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-all cursor-pointer group">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="text-muted-foreground mb-1">Drop your image here or click to browse</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Tell us about your trip plans, preferences, or any special requirements..."
                  value={tripData.description}
                  onChange={(e) => setTripData({ ...tripData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                ></textarea>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleAIGenerate}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-4 rounded-xl text-white hover:opacity-90 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Trip with AI
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 border border-border rounded-xl hover:bg-white/5 transition-all"
                  >
                    Create Manually
                  </button>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  AI will suggest destinations, activities, and create a complete itinerary based on your preferences
                </p>
              </div>
            </form>
          </GlassCard>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <GlassCard className="p-6 text-center">
              <div className="bg-primary/20 p-3 rounded-xl w-fit mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Smart suggestions based on your preferences and budget
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="bg-secondary/20 p-3 rounded-xl w-fit mx-auto mb-3">
                <MapPin className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold mb-2">Multi-City</h3>
              <p className="text-sm text-muted-foreground">
                Plan trips across multiple destinations seamlessly
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="bg-accent/20 p-3 rounded-xl w-fit mx-auto mb-3">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">Flexible</h3>
              <p className="text-sm text-muted-foreground">
                Easily adjust dates, activities, and destinations anytime
              </p>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
