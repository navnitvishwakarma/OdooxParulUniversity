import { useState } from 'react';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Sparkles, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface Props { trip: any; onClose: () => void; }

export function AiSuggestPanel({ trip, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [prefs, setPrefs] = useState('Historical sites, local food, adventure');
  const [dest, setDest] = useState(trip?.stops?.[0]?.city?.name || trip?.name || '');
  const [days, setDays] = useState(String(Math.max(trip?.stops?.length || 1, 3)));
  const [expanded, setExpanded] = useState<number | null>(0);

  const suggest = async () => {
    if (!dest) { toast.error('Enter a destination first'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/ai/suggest', { destination: dest, days: parseInt(days), preferences: prefs });
      setResult(data);
      toast.success('AI itinerary generated!');
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'AI generation failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <GlassCard className="w-full max-w-2xl p-6 relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          <span className="text-2xl">✨</span> Gemini AI Trip Planner
        </h2>
        <p className="text-sm text-muted-foreground mb-5">Let AI build your perfect itinerary</p>

        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div className="sm:col-span-1">
            <label className="text-xs text-muted-foreground mb-1 block">Destination</label>
            <input value={dest} onChange={e => setDest(e.target.value)} placeholder="e.g. Paris" className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Days</label>
            <input type="number" min="1" max="30" value={days} onChange={e => setDays(e.target.value)} className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">&nbsp;</label>
            <button onClick={suggest} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-primary px-4 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-all">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1 block">Preferences</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {['Historical sites', 'Local food', 'Adventure', 'Beach', 'Culture', 'Nightlife', 'Budget travel', 'Luxury'].map(p => (
              <button key={p} onClick={() => setPrefs(prev => prev.includes(p) ? prev.replace(p, '').replace(/, ,/, ',').trim() : prev ? `${prev}, ${p}` : p)} className={`px-3 py-1 rounded-full text-xs border transition-all ${prefs.includes(p) ? 'bg-primary/30 border-primary/50 text-primary' : 'border-border/50 hover:bg-white/10'}`}>{p}</button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-10">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Gemini is crafting your perfect trip...</p>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-3 mt-4 border-t border-border pt-4">
            <h3 className="font-bold text-sm text-accent">Your AI Itinerary for {dest}</h3>
            {result.itinerary?.map((day: any) => (
              <div key={day.day} className="border border-border/50 rounded-xl overflow-hidden">
                <button onClick={() => setExpanded(expanded === day.day ? null : day.day)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all">
                  <span className="font-bold text-sm">Day {day.day}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">{day.activities?.length} activities {expanded === day.day ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}</span>
                </button>
                {expanded === day.day && (
                  <div className="border-t border-border/50 divide-y divide-border/30">
                    {day.activities?.map((act: any, i: number) => (
                      <div key={i} className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary capitalize">{act.time || act.type}</span>
                          <span className="font-medium text-sm">{act.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{act.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {result.tips?.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
                <h4 className="font-bold text-sm mb-2 text-accent">Pro Tips</h4>
                <ul className="space-y-1">{result.tips.map((t: string, i: number) => <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-accent">•</span>{t}</li>)}</ul>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
