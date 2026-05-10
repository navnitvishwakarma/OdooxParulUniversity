import { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { X, Sparkles, Send, Loader2, Calendar, MapPin, Compass } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDestination?: string;
}

interface Suggestion {
  itinerary: {
    day: number;
    activities: {
      time: string;
      name: string;
      description: string;
      type: string;
    }[];
  }[];
  tips: string[];
}

export function AIAssistantModal({ isOpen, onClose, initialDestination }: AIAssistantModalProps) {
  const [destination, setDestination] = useState(initialDestination || '');
  const [days, setDays] = useState('3');
  const [preferences, setPreferences] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Suggestion | null>(null);

  useEffect(() => {
    if (isOpen && initialDestination) {
      setDestination(initialDestination);
      setResult(null); // Reset results when opening with a new destination
    }
  }, [isOpen, initialDestination]);

  const fallbacks: Record<string, Suggestion> = {
    'china': {
      itinerary: [
        { day: 1, activities: [{ time: 'morning', name: 'Great Wall of China', description: 'Visit the Badaling or Mutianyu section.', type: 'SIGHTSEEING' }, { time: 'afternoon', name: 'Forbidden City', description: 'Explore the imperial palace.', type: 'CULTURE' }, { time: 'evening', name: 'Wangfujing Street', description: 'Street food and shopping.', type: 'FOOD' }] },
        { day: 2, activities: [{ time: 'morning', name: 'Temple of Heaven', description: 'Royal sacrificial altar.', type: 'CULTURE' }, { time: 'afternoon', name: 'Summer Palace', description: 'Imperial gardens and Kunming Lake.', type: 'SIGHTSEEING' }, { time: 'evening', name: 'Peking Duck Dinner', description: 'Traditional Beijing cuisine.', type: 'FOOD' }] }
      ],
      tips: ['Get a VPN before you travel.', 'Use WeChat Pay or Alipay for payments.', 'Carry your passport at all times.']
    },
    'paris': {
      itinerary: [
        { day: 1, activities: [{ time: 'morning', name: 'Eiffel Tower', description: 'Iconic iron tower with city views.', type: 'SIGHTSEEING' }, { time: 'afternoon', name: 'Louvre Museum', description: 'Home to the Mona Lisa.', type: 'CULTURE' }, { time: 'evening', name: 'Seine River Cruise', description: 'Romantic boat ride.', type: 'ADVENTURE' }] },
        { day: 2, activities: [{ time: 'morning', name: 'Notre Dame & Latin Quarter', description: 'Historic cathedral area.', type: 'CULTURE' }, { time: 'afternoon', name: 'Montmartre', description: 'Artist district and Sacré-Cœur.', type: 'SIGHTSEEING' }, { time: 'evening', name: 'French Bistro Dinner', description: 'Enjoy local steak frites.', type: 'FOOD' }] }
      ],
      tips: ['Book museum tickets in advance.', 'Learn basic French greetings.', 'Be aware of pickpockets in tourist areas.']
    },
    'india': {
      itinerary: [
        { day: 1, activities: [{ time: 'morning', name: 'Taj Mahal', description: 'The ultimate symbol of love in Agra.', type: 'SIGHTSEEING' }, { time: 'afternoon', name: 'Agra Fort', description: 'UNESCO World Heritage site.', type: 'CULTURE' }, { time: 'evening', name: 'Mehtab Bagh', description: 'Sunset view of the Taj.', type: 'SIGHTSEEING' }] },
        { day: 2, activities: [{ time: 'morning', name: 'Qutub Minar', description: 'Tallest brick minaret in the world (Delhi).', type: 'CULTURE' }, { time: 'afternoon', name: 'Humayun’s Tomb', description: 'Precursor to the Taj Mahal.', type: 'CULTURE' }, { time: 'evening', name: 'Chandni Chowk', description: 'Street food and spice market.', type: 'FOOD' }] }
      ],
      tips: ['Carry bottled water.', 'Negotiate prices at local markets.', 'Try the local Masala Chai.']
    }
  };

  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !days) return;

    try {
      setIsLoading(true);
      const { data } = await api.post('/ai/suggest', {
        destination,
        days: parseInt(days),
        preferences
      });
      setResult(data);
    } catch (err) {
      console.error('AI Error:', err);
      
      // Fallback logic
      const destLower = destination.toLowerCase();
      let matchedKey = '';
      if (destLower.includes('china')) matchedKey = 'china';
      else if (destLower.includes('paris')) matchedKey = 'paris';
      else if (destLower.includes('india')) matchedKey = 'india';

      if (matchedKey && fallbacks[matchedKey]) {
        setResult(fallbacks[matchedKey]);
      } else {
        // Dynamic fallback for any destination so the UI doesn't break
        const numDays = parseInt(days) || 3;
        const mockItinerary = [];
        for (let i = 1; i <= numDays; i++) {
          mockItinerary.push({
            day: i,
            activities: [
              { time: 'morning', name: `Explore Central ${destination}`, description: `Start the day exploring the main sights of ${destination}.`, type: 'SIGHTSEEING' },
              { time: 'afternoon', name: 'Local Museum & Culture', description: 'Dive into the local history and culture.', type: 'CULTURE' },
              { time: 'evening', name: 'Traditional Dinner', description: 'Enjoy local cuisine at a highly-rated restaurant.', type: 'FOOD' }
            ]
          });
        }
        setResult({
          itinerary: mockItinerary,
          tips: [
            `Check the local weather forecast for ${destination} before packing.`,
            'Book major attractions in advance to avoid long lines.',
            'Keep a digital copy of your travel documents.'
          ]
        });
        toast.info('Using offline fallback itinerary due to AI server limits.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl"
        >
          <GlassCard className="max-h-[85vh] flex flex-col p-0 border-primary/30 shadow-2xl shadow-primary/20 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI Travel Assistant</h2>
                  <p className="text-xs text-muted-foreground">Powered by Google Gemini</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!result && !isLoading ? (
                <form onSubmit={handleSuggest} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> Where are you going?
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Paris, France"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-secondary" /> Duration (Days)
                        </label>
                        <input 
                          type="number" 
                          min="1" max="14"
                          value={days}
                          onChange={(e) => setDays(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          <Compass className="w-4 h-4 text-accent" /> Style
                        </label>
                        <select 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                          value={preferences}
                          onChange={(e) => setPreferences(e.target.value)}
                        >
                          <option value="">Any Style</option>
                          <option value="luxury">Luxury</option>
                          <option value="budget">Budget-Friendly</option>
                          <option value="adventure">Adventure</option>
                          <option value="relaxed">Relaxed</option>
                          <option value="foodie">Food & Culture</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Anything else?</label>
                      <textarea 
                        placeholder="e.g. Vegetarian food options, wheelchair accessible, traveling with kids..."
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-[100px] resize-none"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary py-4 rounded-xl text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate AI Trip Plan
                  </button>
                </form>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative mb-6">
                    <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
                    <Sparkles className="w-8 h-8 text-primary absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Crafting your perfect itinerary...</h3>
                  <p className="text-muted-foreground">Our AI is analyzing top spots in {destination}</p>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Trip to {destination}</h3>
                    <button 
                      onClick={() => setResult(null)}
                      className="text-sm text-primary hover:underline"
                    >
                      Start Over
                    </button>
                  </div>

                  <div className="space-y-6">
                    {result?.itinerary.map((day) => (
                      <div key={day.day} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
                            {day.day}
                          </div>
                          <h4 className="font-bold text-lg">Day {day.day}</h4>
                        </div>
                        <div className="space-y-3 pl-11">
                          {day.activities.map((activity, i) => (
                            <div key={i} className="relative pl-6 border-l border-white/10 pb-4 last:pb-0">
                              <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                              <div className="text-xs font-bold text-secondary uppercase mb-1">{activity.time}</div>
                              <div className="font-bold mb-1">{activity.name}</div>
                              <div className="text-sm text-muted-foreground">{activity.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {result?.tips && result.tips.length > 0 && (
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Compass className="w-5 h-5 text-accent" /> Local Tips
                      </h4>
                      <ul className="space-y-2">
                        {result.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-accent">•</span> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
