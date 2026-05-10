import { useState, useEffect } from 'react';
import { useParams as useRouterParams, Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { Package, Plus, Trash2, CheckCircle, Circle, Loader2 } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  is_packed: boolean;
  category: string;
}

export function PackingChecklist() {
  const { id: tripId } = useRouterParams();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newItemText, setNewItemText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const categories = ['All', 'DOCUMENTS', 'CLOTHING', 'ELECTRONICS', 'OTHER'];
  const categoryLabels: Record<string, string> = {
    'All': 'All',
    'DOCUMENTS': 'Documents',
    'CLOTHING': 'Clothing',
    'ELECTRONICS': 'Electronics',
    'OTHER': 'Other'
  };

  const [trips, setTrips] = useState<any[]>([]);
  const [isTripsLoading, setIsTripsLoading] = useState(false);

  // Fetch trips if no tripId is provided
  useEffect(() => {
    if (tripId) return;
    const fetchTrips = async () => {
      try {
        setIsTripsLoading(true);
        const { data } = await api.get('/trips');
        setTrips(data);
      } catch (err) {
        console.error('Failed to fetch trips:', err);
      } finally {
        setIsTripsLoading(false);
      }
    };
    fetchTrips();
  }, [tripId]);

  // Fetch checklist from backend
  useEffect(() => {
    if (!tripId) return;
    const fetchChecklist = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/trips/${tripId}/checklist`);
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch checklist:', err);
        toast.error('Could not load checklist.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchChecklist();
  }, [tripId]);

  const toggleItem = async (item: ChecklistItem) => {
    try {
      const { data } = await api.put(`/trips/${tripId}/checklist/${item.id}`, {
        is_packed: !item.is_packed,
        label: item.label,
        category: item.category
      });
      setItems(prev => prev.map(i => i.id === item.id ? data : i));
    } catch (err) {
      toast.error('Failed to update item.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await api.delete(`/trips/${tripId}/checklist/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      toast.error('Failed to delete item.');
    }
  };

  const addItem = async () => {
    if (!newItemText.trim() || !tripId) return;
    try {
      setIsAdding(true);
      const { data } = await api.post(`/trips/${tripId}/checklist`, {
        label: newItemText.trim(),
        category: selectedCategory === 'All' ? 'OTHER' : selectedCategory,
      });
      setItems(prev => [...prev, data]);
      setNewItemText('');
    } catch (err) {
      toast.error('Failed to add item.');
    } finally {
      setIsAdding(false);
    }
  };

  const filteredItems = selectedCategory === 'All' ? items : items.filter(i => i.category === selectedCategory);
  const totalItems = items.length;
  const checkedItems = items.filter(i => i.is_packed).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  if (!tripId) {
    return (
      <div className="min-h-screen">
        <Navbar /><Sidebar />
        <main className="ml-64 px-8 pb-8 pt-28">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Packing Checklist</h1>
              <p className="text-muted-foreground">Select a trip to manage its packing list</p>
            </div>

            {isTripsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : trips.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h2 className="text-2xl font-bold mb-2">No Trips Found</h2>
                <p className="text-muted-foreground mb-6">You need to create a trip before you can manage a packing checklist.</p>
                <Link to="/create-trip" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white hover:opacity-90 transition-all">
                  <Plus className="w-5 h-5" /> Create a Trip
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {trips.map((trip) => (
                  <Link key={trip.id} to={`/packing/${trip.id}`}>
                    <GlassCard hover className="p-6 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/20 p-3 rounded-xl">
                          <Package className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold group-hover:text-primary transition-colors">{trip.name}</h3>
                          <p className="text-xs text-muted-foreground">{new Date(trip.start_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:scale-110" />
                    </GlassCard>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />
      <main className="ml-64 px-8 pb-8 pt-28">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Packing Checklist</h1>
            <p className="text-muted-foreground">Stay organized and don't forget anything</p>
          </div>

          <GlassCard className="p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Overall Progress</div>
                <div className="text-3xl font-bold">{checkedItems} / {totalItems} items</div>
              </div>
              <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </GlassCard>

          <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button key={category} onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${selectedCategory === category ? 'bg-gradient-to-r from-primary to-secondary text-white' : 'bg-white/5 hover:bg-white/10'}`}>
                {categoryLabels[category]}
              </button>
            ))}
          </div>

          <GlassCard className="p-6 mb-6">
            <div className="flex gap-3">
              <input type="text" placeholder="Add new item..." value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
                className="flex-1 bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
              <button onClick={addItem} disabled={isAdding}
                className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-70">
                {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Add
              </button>
            </div>
          </GlassCard>

          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <GlassCard key={item.id} className={`p-4 transition-all ${item.is_packed ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleItem(item)} className="flex-shrink-0">
                      {item.is_packed
                        ? <CheckCircle className="w-6 h-6 text-primary" />
                        : <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />}
                    </button>
                    <div className="flex-1">
                      <div className={`${item.is_packed ? 'line-through text-muted-foreground' : ''}`}>{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-1 capitalize">{item.category.toLowerCase()}</div>
                    </div>
                    <button onClick={() => deleteItem(item.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </GlassCard>
              ))}
              {filteredItems.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No items in this category. Add one above!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
