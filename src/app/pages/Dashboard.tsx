import { Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { WeatherWidget } from '../components/WeatherWidget';
import { CurrencyConverter } from '../components/CurrencyConverter';
import { useUser } from '../../context/UserContext';
import { PlusCircle, MapPin, DollarSign, Calendar, TrendingUp, Sparkles, Users, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard() {
  const { user } = useUser();

  const upcomingTrips = [
    {
      id: 1,
      destination: 'Tokyo, Japan',
      dates: 'June 15 - 25, 2026',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      budget: '$3,500',
      progress: 75,
    },
    {
      id: 2,
      destination: 'Paris, France',
      dates: 'July 10 - 20, 2026',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      budget: '$4,200',
      progress: 45,
    },
    {
      id: 3,
      destination: 'Bali, Indonesia',
      dates: 'August 5 - 18, 2026',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      budget: '$2,800',
      progress: 20,
    },
  ];

  const popularDestinations = [
    { name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400' },
    { name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
    { name: 'Iceland', country: 'Reykjavik', image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=400' },
    { name: 'Morocco', country: 'Marrakech', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400' },
  ];

  const recentActivities = [
    { action: 'Created trip to Tokyo', time: '2 hours ago', icon: MapPin },
    { action: 'Added budget for Paris trip', time: '5 hours ago', icon: DollarSign },
    { action: 'Invited Sarah to Bali trip', time: '1 day ago', icon: Users },
    { action: 'Booked hotel in Tokyo', time: '2 days ago', icon: Calendar },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="ml-64 px-8 pb-8 pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="pl-1">
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}!</h1>
              <p className="text-muted-foreground">Ready to plan your next adventure?</p>
            </div>
            <Link
              to="/create-trip"
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white hover:opacity-90 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              New Trip
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary/20 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-sm text-muted-foreground">Total Trips</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-secondary/20 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-secondary" />
                </div>
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div className="text-3xl font-bold mb-1">3</div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-accent/20 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">$10.5K</div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">8</div>
              <div className="text-sm text-muted-foreground">Travel Buddies</div>
            </GlassCard>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Upcoming Trips</h2>
                <Link to="/itinerary/1" className="text-primary hover:underline text-sm">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/itinerary/${trip.id}`}>
                      <GlassCard hover className="p-6">
                        <div className="flex gap-6">
                          <img
                            src={trip.image}
                            alt={trip.destination}
                            className="w-32 h-32 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold mb-1">{trip.destination}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  {trip.dates}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground mb-1">Budget</div>
                                <div className="text-lg font-bold text-accent">{trip.budget}</div>
                              </div>
                            </div>
                            <div className="mb-2">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Planning Progress</span>
                                <span className="font-bold">{trip.progress}%</span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                                  style={{ width: `${trip.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <GlassCard className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm mb-1">{activity.action}</div>
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              <h2 className="text-2xl font-bold mb-6 mt-8">AI Suggestions</h2>
              <GlassCard className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Perfect Time to Visit Tokyo</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on your preferences, June offers great weather and lower prices for Tokyo.
                    </p>
                    <button className="text-sm text-primary hover:underline">Learn more →</button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Explore Destinations</h2>
              <Link to="/activities" className="text-primary hover:underline text-sm">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {popularDestinations.map((dest, index) => (
                <GlassCard key={index} hover className="overflow-hidden group">
                  <div className="relative h-48">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white mb-1">{dest.name}</h3>
                      <p className="text-sm text-gray-300">{dest.country}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
