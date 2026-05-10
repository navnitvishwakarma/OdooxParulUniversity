import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { User, Mail, MapPin, Calendar, Settings, Bell, Lock, CreditCard, Globe, Moon, Sun } from 'lucide-react';

export function UserProfile() {
  const [darkMode, setDarkMode] = useState(true);

  const savedDestinations = [
    { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400', saves: 234 },
    { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', saves: 189 },
    { name: 'Iceland', image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=400', saves: 421 },
    { name: 'Morocco', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400', saves: 312 },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="ml-64 pt-20 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Profile & Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <GlassCard className="p-8 text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  />
                  <button className="absolute bottom-0 right-0 bg-gradient-to-r from-primary to-secondary p-2.5 rounded-full text-white hover:opacity-90 transition-all">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold mb-1">Alex Morgan</h2>
                <p className="text-muted-foreground mb-4">alex.morgan@email.com</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-muted-foreground">Trips</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">8</div>
                    <div className="text-muted-foreground">Friends</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div>
                    <div className="text-2xl font-bold text-accent">24</div>
                    <div className="text-muted-foreground">Saved</div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <span>Dark Mode</span>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        darkMode ? 'bg-primary' : 'bg-white/20'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-all ${
                          darkMode ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      ></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5" />
                      <span>Notifications</span>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-primary">
                      <div className="w-5 h-5 bg-white rounded-full translate-x-6"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5" />
                      <span>Language</span>
                    </div>
                    <select className="bg-input-background border border-border rounded-lg px-3 py-1.5 text-sm">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Alex Morgan"
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        defaultValue="alex.morgan@email.com"
                        className="w-full bg-input-background border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        defaultValue="San Francisco, CA"
                        className="w-full bg-input-background border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2">Bio</label>
                    <textarea
                      rows={3}
                      defaultValue="Adventure seeker and travel enthusiast. Love exploring new cultures and trying local cuisines."
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
                <button className="mt-6 bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white hover:opacity-90 transition-all">
                  Save Changes
                </button>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white hover:opacity-90 transition-all">
                    Update Password
                  </button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-bold mb-6">Saved Destinations</h3>
                <div className="grid grid-cols-2 gap-4">
                  {savedDestinations.map((dest, index) => (
                    <GlassCard key={index} hover className="overflow-hidden group">
                      <div className="relative h-32">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h4 className="font-bold text-sm mb-1">{dest.name}</h4>
                          <p className="text-xs text-gray-300">{dest.saves} saves</p>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
