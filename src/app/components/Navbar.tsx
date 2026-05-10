import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Plane, Menu, Bell, User, LogOut, Search, Plus, MapPin, ChevronDown, Calendar, CloudRain, Map } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';
import { WeatherWidget } from './WeatherWidget';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Detecting...');
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const mockSuggestions = [
    'Pune, India',
    'Paris, France',
    'Tokyo, Japan',
    'Bali, Indonesia',
    'Goa, India',
    'Santorini, Greece',
    'Dubai, UAE',
    'New York, USA'
  ];

  const filteredSuggestions = mockSuggestions.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Format current date
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  useEffect(() => {
    // Simulate auto-detect location
    const timer = setTimeout(() => {
      setCurrentLocation('Vadodara, IN');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-white/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-300 shadow-sm' 
          : 'bg-white/80 dark:bg-white backdrop-blur-md border-b border-gray-200 dark:border-gray-300'
      }`}
    >
      <div className="w-full px-6 py-3 dark:text-slate-900">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group relative">
            {/* Soft Glow Behind Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {/* Glassmorphism Compact Container */}
            <div className="relative flex items-center gap-3 bg-white/60 dark:bg-slate-100 backdrop-blur-md border border-white/50 dark:border-gray-300 shadow-sm p-1.5 pr-4 rounded-xl transition-all duration-300 group-hover:shadow-md group-hover:border-primary/30 group-hover:-translate-y-0.5">
              <img 
                src="/logo.png" 
                alt="Travel Buddy Logo" 
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-bold text-lg tracking-tight hidden sm:block text-slate-900">Travel Buddy</span>
            </div>
          </Link>

          {isLanding ? (
            <div className="flex items-center gap-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#destinations" className="text-muted-foreground hover:text-foreground transition-colors">
                Destinations
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </a>
              <Link
                to="/auth"
                className="bg-gradient-to-r from-primary to-secondary px-6 py-2.5 rounded-xl text-white hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <>
              {/* Premium Search Bar with Location */}
              <div className="hidden md:flex flex-1 max-w-2xl mx-8 gap-2 relative group">
                
                {/* Location Selector */}
                <div 
                  className="relative flex items-center bg-white/80 dark:bg-slate-100 backdrop-blur-md border border-black/5 dark:border-gray-300 hover:border-primary/30 rounded-2xl px-4 py-2.5 text-sm transition-all duration-300 shadow-sm cursor-pointer min-w-[150px] group/loc"
                  title="Detect automatically or set manually"
                >
                  <MapPin className="w-4 h-4 text-slate-500 group-hover/loc:text-primary mr-2" />
                  <span className="text-slate-900 font-medium truncate flex-1">{currentLocation}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500 ml-2" />
                </div>

                {/* Search Input */}
                <div ref={searchRef} className="relative w-full flex items-center flex-1">
                  {/* Soft glowing background on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
                  
                  <Search className="absolute left-4 w-4 h-4 text-slate-500 group-hover:text-primary transition-colors z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search destinations, trips, or activities..."
                    className="relative w-full h-11 bg-white/80 dark:bg-slate-100 backdrop-blur-md border border-black/5 dark:border-gray-300 hover:border-primary/30 focus:border-primary focus:bg-white dark:focus:bg-white rounded-2xl pl-12 pr-16 text-sm leading-normal transition-all duration-300 outline-none shadow-sm dark:text-slate-900 dark:placeholder:text-slate-500"
                  />
                  <div className="absolute right-3 flex items-center">
                    <kbd className="inline-flex items-center gap-1 bg-black/5 dark:bg-slate-200 border border-black/10 dark:border-gray-300 rounded-lg px-2 py-1 text-[10px] font-semibold text-slate-500 shadow-sm">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </div>

                  {/* Suggestions Dropdown */}
                  {showSuggestions && searchQuery.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-100 rounded-2xl shadow-xl border border-black/5 dark:border-gray-300 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {filteredSuggestions.length > 0 ? (
                        <ul className="py-2">
                          {filteredSuggestions.map((suggestion, index) => (
                            <li key={index}>
                              <button
                                onClick={() => {
                                  setSearchQuery(suggestion);
                                  setShowSuggestions(false);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-black/5 dark:hover:bg-black/5 flex items-center gap-3 transition-colors group/item"
                              >
                                <Map className="w-4 h-4 text-slate-400 group-hover/item:text-primary transition-colors" />
                                <span className="text-sm font-medium dark:text-slate-900">{suggestion}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-6 text-center text-sm text-slate-500">
                          No destinations found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Date & Weather Widget (Interactive Popover) */}
                <div className="relative hidden lg:block">
                  <button 
                    onClick={() => setShowWeather(!showWeather)}
                    className="flex items-center gap-3 bg-white/60 dark:bg-slate-100 backdrop-blur-md border border-black/5 dark:border-gray-300 rounded-xl px-3 py-2 text-sm font-medium shadow-sm hover:bg-white dark:hover:bg-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-slate-500 border-r border-gray-200 dark:border-gray-300 pr-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="dark:text-slate-900">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-500">
                      <CloudRain className="w-4 h-4" />
                      <span>Monsoon</span>
                    </div>
                  </button>

                  {/* Weather Popover */}
                  {showWeather && (
                    <div className="absolute top-full mt-3 right-0 w-[340px] z-50">
                      <WeatherWidget />
                    </div>
                  )}
                </div>

                {/* Quick Action Button */}
                <Link 
                  to="/create-trip"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </Link>
                
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-300 mx-1 hidden sm:block"></div>

                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-primary/10 rounded-xl transition-colors relative group"
                >
                  <Bell className="w-5 h-5 text-slate-700 dark:text-slate-600 group-hover:text-primary transition-colors" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
                </button>
                <Link to="/profile" className="p-2 hover:bg-primary/10 rounded-xl transition-colors group">
                  <User className="w-5 h-5 text-slate-700 dark:text-slate-600 group-hover:text-primary transition-colors" />
                </Link>
                <button
                  onClick={() => navigate('/')}
                  className="p-2 hover:bg-destructive/10 text-slate-500 dark:text-slate-500 hover:text-destructive rounded-xl transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </nav>
  );
}
