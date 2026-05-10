import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { Upload, Sparkles, Calendar, MapPin, FileText, Loader2 } from 'lucide-react';

export function CreateTrip() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripData, setTripData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    coverImage: ''
  });
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    if (!tripData.name || !tripData.destination || !tripData.startDate || !tripData.endDate) {
      setError('Please fill in all required fields (Name, Destination, Start Date, End Date)');
      return false;
    }
    
    if (new Date(tripData.endDate) < new Date(tripData.startDate)) {
      setError('End Date cannot be before Start Date');
      return false;
    }
    return true;
  };

  const saveAndNavigate = (isAi: boolean) => {
    const tripId = Date.now().toString();
    const newTrip = {
      id: tripId,
      ...tripData,
      isAiGenerated: isAi,
      createdAt: new Date().toISOString()
    };
    
    // Save to local storage for persistence across pages
    const existingTrips = JSON.parse(localStorage.getItem('travel_buddy_trips') || '[]');
    localStorage.setItem('travel_buddy_trips', JSON.stringify([...existingTrips, newTrip]));
    
    // Also save as current trip for the itinerary page
    localStorage.setItem('travel_buddy_current_trip', JSON.stringify(newTrip));
    
    navigate(`/itinerary/${tripId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    saveAndNavigate(false);
  };

  const handleAIGenerate = () => {
    if (!validateForm()) return;
    setIsGenerating(true);
    setTimeout(() => {
      saveAndNavigate(true);
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTripData({ ...tripData, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="ml-64 pt-20 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create New Trip</h1>
            <p className="text-muted-foreground">Start planning your next adventure</p>
          </div>

          <GlassCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm">
                  {error}
                </div>
              )}
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
                <div 
                  className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-all cursor-pointer group relative overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/png, image/jpeg" 
                    className="hidden" 
                  />
                  {tripData.coverImage ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img src={tripData.coverImage} alt="Cover preview" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                        <Upload className="w-8 h-8 text-white mb-2" />
                        <p className="text-white font-medium">Change Image</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="text-muted-foreground mb-1">Drop your image here or click to browse</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                    </>
                  )}
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
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-4 rounded-xl text-white hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Magic...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Trip with AI
                      </>
                    )}
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
