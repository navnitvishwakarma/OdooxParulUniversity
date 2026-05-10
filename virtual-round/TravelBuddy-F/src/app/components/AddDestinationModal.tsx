import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { MapPin, Search, Plus, Loader2, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface City { id: string; name: string; country: string; region?: string; }
interface Props { tripId: string; onClose: () => void; onAdded: () => void; }

const POPULAR = [
  { name: 'Paris', country: 'France' }, { name: 'Tokyo', country: 'Japan' },
  { name: 'New York', country: 'USA' }, { name: 'Dubai', country: 'UAE' },
  { name: 'London', country: 'UK' }, { name: 'Bali', country: 'Indonesia' },
  { name: 'Singapore', country: 'Singapore' }, { name: 'Rome', country: 'Italy' },
  { name: 'Bangkok', country: 'Thailand' }, { name: 'Sydney', country: 'Australia' },
  { name: 'Mumbai', country: 'India' }, { name: 'Goa', country: 'India' },
];

export function AddDestinationModal({ tripId, onClose, onAdded }: Props) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [dates, setDates] = useState({ arrival: '', departure: '' });

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get(`/cities?q=${encodeURIComponent(q)}`);
        setResults(data);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  const addCity = async (city: City | { name: string; country: string }) => {
    setAdding(city.name);
    try {
      let cityId = (city as City).id;
      if (!cityId) {
        const { data } = await api.post('/cities', { name: city.name, country: city.country });
        cityId = data.id;
      }
      await api.post(`/trips/${tripId}/stops`, {
        city_id: cityId,
        arrival_date: dates.arrival || null,
        departure_date: dates.departure || null,
      });
      toast.success(`${city.name} added to your trip!`);
      onAdded();
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to add destination');
    } finally { setAdding(null); }
  };

  const shown = results.length > 0 ? results : (q.trim() ? [] : POPULAR);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <GlassCard className="w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Add Destination</h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search city or country..." className="w-full bg-input-background border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Arrival Date</label>
            <input type="date" value={dates.arrival} onChange={e => setDates(d => ({ ...d, arrival: e.target.value }))} className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Departure Date</label>
            <input type="date" value={dates.departure} onChange={e => setDates(d => ({ ...d, departure: e.target.value }))} className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        {!q && <p className="text-xs text-muted-foreground mb-2">Popular destinations</p>}
        {q && results.length === 0 && !searching && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-2">No saved cities found. Add "{q}" as new destination:</p>
            <button onClick={() => addCity({ name: q, country: 'Unknown' })} disabled={!!adding} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/20 hover:bg-primary/30 transition-all border border-primary/30 text-left">
              <Plus className="w-4 h-4 text-primary" /> <span className="font-medium">{q}</span>
              {adding === q && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
            </button>
          </div>
        )}
        <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
          {shown.map((c, i) => (
            <button key={(c as City).id || i} onClick={() => addCity(c)} disabled={!!adding} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/10 transition-all border border-border/50 text-left group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{c.name[0]}</div>
                <div><p className="font-medium text-sm">{c.name}</p><p className="text-xs text-muted-foreground">{c.country}</p></div>
              </div>
              {adding === c.name ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />}
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
