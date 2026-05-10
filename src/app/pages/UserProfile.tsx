import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { toast } from 'sonner';
import { User, Mail, MapPin, Calendar, Settings, Bell, Lock, CreditCard, Globe, Moon, Sun } from 'lucide-react';

export function UserProfile() {
  const { language, setLanguage, t } = useTranslation();
  const { user, setUser } = useUser();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [notifications, setNotifications] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [draftInfo, setDraftInfo] = useState(user);

  const handleSaveProfile = () => {
    setUser(draftInfo);
    toast.success(language === 'English' ? 'Profile updated successfully' : 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, image: imageUrl });
      setDraftInfo({ ...draftInfo, image: imageUrl });
    }
  };

  const [destinations, setDestinations] = useState([
    { id: 1, name: 'Laxmi Vilas Palace', image: '/images/laxmi_vilas.png', saves: 234 },
    { id: 2, name: 'Statue of Unity', image: '/images/statue_of_unity.png', saves: 189 },
    { id: 3, name: 'Champaner-Pavagadh', image: '/images/champaner.png', saves: 421 },
    { id: 4, name: 'Sayaji Baug', image: '/images/sayaji_baug.png', saves: 312 },
  ]);

  const destInputRef = useRef<HTMLInputElement>(null);
  const [editingDestId, setEditingDestId] = useState<number | null>(null);

  const handleDestImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingDestId) {
      const imageUrl = URL.createObjectURL(file);
      setDestinations(dests => dests.map(d => d.id === editingDestId ? { ...d, image: imageUrl } : d));
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="ml-64 pt-20 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{t('profile.title')}</h1>
            <p className="text-muted-foreground">{t('profile.subtitle')}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <GlassCard className="p-8 text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-gradient-to-r from-primary to-secondary p-2.5 rounded-full text-white hover:opacity-90 transition-all cursor-pointer"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-muted-foreground">{t('profile.trips')}</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">8</div>
                    <div className="text-muted-foreground">{t('profile.friends')}</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div>
                    <div className="text-2xl font-bold text-accent">24</div>
                    <div className="text-muted-foreground">{t('profile.saved')}</div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {t('profile.quickSettings')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <span>{t('profile.darkMode')}</span>
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
                      <span>{t('profile.notifications')}</span>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        notifications ? 'bg-primary' : 'bg-input-background border border-border'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-all ${
                          notifications ? 'translate-x-6' : 'translate-x-0.5 bg-muted-foreground'
                        }`}
                      ></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5" />
                      <span>{t('profile.language')}</span>
                    </div>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="bg-background text-foreground border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option className="bg-background text-foreground" value="English">English</option>
                      <option className="bg-background text-foreground" value="Hindi">Hindi</option>
                      <option className="bg-background text-foreground" value="Gujarati">Gujarati</option>
                      <option className="bg-background text-foreground" value="Marathi">Marathi</option>
                      <option className="bg-background text-foreground" value="Spanish">Spanish</option>
                      <option className="bg-background text-foreground" value="French">French</option>
                      <option className="bg-background text-foreground" value="Japanese">Japanese</option>
                    </select>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('profile.personalInfo')}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2">{t('profile.fullName')}</label>
                    <input
                      type="text"
                      value={draftInfo.name}
                      onChange={(e) => setDraftInfo({...draftInfo, name: e.target.value})}
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">{t('profile.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={draftInfo.email}
                        onChange={(e) => setDraftInfo({...draftInfo, email: e.target.value})}
                        className="w-full bg-input-background border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">{t('profile.phone')}</label>
                    <input
                      type="tel"
                      value={draftInfo.phone}
                      onChange={(e) => setDraftInfo({...draftInfo, phone: e.target.value})}
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">{t('profile.location')}</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={draftInfo.location}
                        onChange={(e) => setDraftInfo({...draftInfo, location: e.target.value})}
                        className="w-full bg-input-background border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2">{t('profile.bio')}</label>
                    <textarea
                      rows={3}
                      value={draftInfo.bio}
                      onChange={(e) => setDraftInfo({...draftInfo, bio: e.target.value})}
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
                <button 
                  onClick={handleSaveProfile}
                  className="mt-6 bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white hover:opacity-90 transition-all"
                >
                  {t('profile.saveChanges')}
                </button>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  {t('profile.security')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">{t('profile.currentPassword')}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">{t('profile.newPassword')}</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">{t('profile.confirmPassword')}</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white hover:opacity-90 transition-all">
                    {t('profile.updatePassword')}
                  </button>
                </div>
              </GlassCard>

              <GlassCard className="p-6 relative">
                <h3 className="font-bold mb-6">{t('profile.savedDestinations')}</h3>
                <input 
                  type="file" 
                  ref={destInputRef}
                  onChange={handleDestImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="grid grid-cols-2 gap-4">
                  {destinations.map((dest) => (
                    <GlassCard 
                      key={dest.id} 
                      hover 
                      className="overflow-hidden group cursor-pointer"
                      onClick={() => {
                        setEditingDestId(dest.id);
                        destInputRef.current?.click();
                      }}
                    >
                      <div className="relative h-32">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                          <span className="text-white text-sm flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Change Image
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h4 className="font-bold text-sm text-white mb-1">{dest.name}</h4>
                          <p className="text-xs text-gray-300">{dest.saves} {t('profile.saves')}</p>
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
