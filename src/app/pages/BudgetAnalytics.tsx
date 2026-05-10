import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function BudgetAnalytics() {
  const expenseData = [
    { name: 'Accommodation', value: 1200, color: '#4F46E5' },
    { name: 'Food', value: 800, color: '#06B6D4' },
    { name: 'Transport', value: 600, color: '#F97316' },
    { name: 'Activities', value: 500, color: '#8B5CF6' },
    { name: 'Shopping', value: 350, color: '#EC4899' },
  ];

  const dailySpending = [
    { day: 'Day 1', amount: 320 },
    { day: 'Day 2', amount: 280 },
    { day: 'Day 3', amount: 450 },
    { day: 'Day 4', amount: 310 },
    { day: 'Day 5', amount: 390 },
    { day: 'Day 6', amount: 270 },
    { day: 'Day 7', amount: 430 },
  ];

  const monthlyTrend = [
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 1800 },
    { month: 'Mar', amount: 3200 },
    { month: 'Apr', amount: 2800 },
    { month: 'May', amount: 3500 },
    { month: 'Jun', amount: 3450 },
  ];

  const totalBudget = 4000;
  const totalSpent = expenseData.reduce((sum, item) => sum + item.value, 0);
  const remaining = totalBudget - totalSpent;
  const percentageUsed = (totalSpent / totalBudget) * 100;

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="ml-64 pt-20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Budget & Analytics</h1>
            <p className="text-muted-foreground">Track your travel expenses and insights</p>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary/20 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">${totalBudget.toLocaleString()}</div>
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

          {percentageUsed > 85 && (
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

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
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
                      <span className="font-bold">${item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold mb-6">Daily Spending</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySpending}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                      }}
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
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold mb-6">Spending Trend</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#4F46E5"
                        strokeWidth={3}
                        dot={{ fill: '#4F46E5', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="font-bold mb-4">AI Savings Suggestions</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                    <div className="font-bold mb-1">Save $200 on Hotels</div>
                    <p className="text-sm text-muted-foreground">
                      Book accommodations 2 weeks earlier for better rates
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
                    <div className="font-bold mb-1">Transportation Tip</div>
                    <p className="text-sm text-muted-foreground">
                      Get a JR Pass instead of individual tickets and save $150
                    </p>
                  </div>
                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                    <div className="font-bold mb-1">Food Budget</div>
                    <p className="text-sm text-muted-foreground">
                      Mix street food with restaurants to save $100
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-bold mb-4">Budget Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-muted-foreground">Used</span>
                      <span className="font-bold">${totalSpent} / ${totalBudget}</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percentageUsed > 85 ? 'bg-accent' : 'bg-gradient-to-r from-primary to-secondary'
                        }`}
                        style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground mb-1">Daily Average</div>
                    <div className="text-2xl font-bold">${(totalSpent / 7).toFixed(0)}</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
