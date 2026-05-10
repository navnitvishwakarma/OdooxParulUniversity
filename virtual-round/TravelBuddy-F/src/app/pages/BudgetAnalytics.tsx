import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, PieChart as PieChartIcon, Loader2, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BudgetItem {
  id: string;
  category: string;
  label: string;
  amount: number;
  currency: string;
  stop_id: string | null;
  stop?: {
    city: { name: string }
  }
}

interface Trip {
  id: string;
  name: string;
  total_budget: number | null;
}

const COLORS = ['#4F46E5', '#06B6D4', '#F97316', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl py-3 px-4 shadow-xl">
        <p className="text-[#94a3b8] text-sm font-medium mb-1">{label}</p>
        <p className="text-white font-bold">
          {payload[0].name}: ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function BudgetAnalytics() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [isTripsLoading, setIsTripsLoading] = useState(false);

  const [newExpense, setNewExpense] = useState({
    label: '',
    amount: '',
    category: 'OTHER',
  });

  const categories = ['TRANSPORT', 'STAY', 'FOOD', 'ACTIVITY', 'OTHER'];
  const categoryLabels: Record<string, string> = {
    'TRANSPORT': 'Transport',
    'STAY': 'Stay',
    'FOOD': 'Food',
    'ACTIVITY': 'Activity',
    'OTHER': 'Other'
  };

  // Fetch trips if no id is provided
  useEffect(() => {
    if (id) return;
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
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [tripRes, budgetRes] = await Promise.all([
        api.get(`/trips/${id}`),
        api.get(`/trips/${id}/budget`)
      ]);
      setTrip(tripRes.data);
      setBudgetItems(budgetRes.data);
    } catch (err) {
      console.error('Failed to fetch budget data:', err);
      toast.error('Failed to load budget data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editedBudget, setEditedBudget] = useState('');

  const updateTotalBudget = async () => {
    if (!editedBudget || isNaN(Number(editedBudget)) || !id) return;
    try {
      await api.put(`/trips/${id}`, { total_budget: parseFloat(editedBudget) });
      setTrip(prev => prev ? { ...prev, total_budget: parseFloat(editedBudget) } : null);
      setIsEditingBudget(false);
      toast.success('Budget updated!');
    } catch (err) {
      toast.error('Failed to update budget.');
    }
  };

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.label || !newExpense.amount) return;

    try {
      setIsAdding(true);
      const { data } = await api.post(`/trips/${id}/budget`, {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
      });
      setBudgetItems(prev => [...prev, data]);
      setNewExpense({ label: '', amount: '', category: 'OTHER' });
      toast.success('Expense added!');
    } catch (err) {
      toast.error('Failed to add expense.');
    } finally {
      setIsAdding(false);
    }
  };

  const deleteExpense = async (itemId: string) => {
    try {
      await api.delete(`/trips/${id}/budget/${itemId}`);
      setBudgetItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Expense deleted');
    } catch (err) {
      toast.error('Failed to delete expense.');
    }
  };

  // Aggregate by category
  const categoryTotals = budgetItems.reduce((acc: any, item) => {
    acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
    return acc;
  }, {});

  const expenseData = Object.keys(categoryTotals).map((cat, index) => ({
    name: categoryLabels[cat] || cat,
    value: categoryTotals[cat],
    color: COLORS[index % COLORS.length]
  }));

  // Aggregate by stop (city)
  const stopTotals = budgetItems.reduce((acc: any, item) => {
    const cityName = item.stop?.city.name || 'General';
    acc[cityName] = (acc[cityName] || 0) + Number(item.amount);
    return acc;
  }, {});

  const dailySpending = Object.keys(stopTotals).map(city => ({
    name: city,
    amount: stopTotals[city]
  }));

  const totalBudget = Number(trip?.total_budget || 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + Number(item.amount), 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (isLoading && id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!id) {
    return (
      <div className="min-h-screen">
        <Navbar /><Sidebar />
        <main className="ml-64 px-8 pb-8 pt-28">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Budget & Analytics</h1>
              <p className="text-muted-foreground">Select a trip to view its budget and expenses</p>
            </div>

            {isTripsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : trips.length === 0 ? (
              <div className="text-center py-20">
                <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h2 className="text-2xl font-bold mb-2">No Trips Found</h2>
                <p className="text-muted-foreground mb-6">Create your first trip to start tracking expenses.</p>
                <Link to="/create-trip" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white hover:opacity-90 transition-all">
                  <Plus className="w-5 h-5" /> Create a Trip
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {trips.map((trip) => (
                  <Link key={trip.id} to={`/budget/${trip.id}`}>
                    <GlassCard className="p-6 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="bg-accent/20 p-3 rounded-xl">
                          <DollarSign className="w-6 h-6 text-accent" />
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Budget & Analytics</h1>
            <p className="text-muted-foreground">Track your expenses for {trip?.name}</p>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary/20 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <button 
                  onClick={() => {
                    setIsEditingBudget(!isEditingBudget);
                    setEditedBudget(totalBudget.toString());
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  {isEditingBudget ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {isEditingBudget ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={editedBudget}
                    onChange={(e) => setEditedBudget(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button onClick={updateTotalBudget} className="bg-primary px-2 py-1 rounded-lg text-white text-xs">Save</button>
                </div>
              ) : (
                <div className="text-3xl font-bold mb-1">${totalBudget.toLocaleString()}</div>
              )}
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-accent/20 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">${totalSpent.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-secondary/20 p-3 rounded-xl">
                  <TrendingDown className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">${remaining.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <PieChartIcon className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{percentageUsed.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Budget Used</div>
            </GlassCard>
          </div>

          {totalBudget > 0 && percentageUsed > 85 && (
            <GlassCard className="p-4 mb-8 bg-accent/10 border-accent/30">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-accent" />
                <div>
                  <div className="font-bold">Budget Alert</div>
                  <div className="text-sm text-muted-foreground">
                    You've used {percentageUsed.toFixed(0)}% of your budget. Consider adjusting your spending.
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-6">Add Expense</h2>
              <GlassCard className="p-6">
                <form onSubmit={addExpense} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Dinner at Marina"
                      value={newExpense.label}
                      onChange={(e) => setNewExpense({ ...newExpense, label: e.target.value })}
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 text-muted-foreground">Amount ($)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-muted-foreground">Category</label>
                      <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                        className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="w-full bg-gradient-to-r from-primary to-secondary py-3 rounded-xl text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                    Add Expense
                  </button>
                </form>
              </GlassCard>

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Recent Expenses</h2>
                <div className="space-y-3">
                  {budgetItems.slice(-5).reverse().map((item) => (
                    <GlassCard key={item.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-bold">{item.label}</div>
                        <div className="text-xs text-muted-foreground capitalize">{item.category.toLowerCase()}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-accent">${Number(item.amount).toLocaleString()}</div>
                        <button onClick={() => deleteExpense(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              {budgetItems.length === 0 ? (
                <GlassCard className="p-12 text-center">
                  <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-xl font-bold mb-2">No expenses yet!</h3>
                  <p className="text-muted-foreground">Start adding expenses to see your breakdown.</p>
                </GlassCard>
              ) : (
                <>
                  <GlassCard className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Expense Breakdown</h2>
                    <div className="h-80 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {expenseData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      {expenseData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">{item.name}:</span>{' '}
                            <span className="font-bold">${item.value.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Spending by City</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailySpending}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                          <YAxis stroke="var(--muted-foreground)" />
                          <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                            content={<CustomTooltip />}
                          />
                          <Bar dataKey="amount" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4F46E5" />
                              <stop offset="100%" stopColor="#06B6D4" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
