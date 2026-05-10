import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Plane, Menu, Bell, User, LogOut } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
          ? 'bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)] shadow-sm' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group relative">
            {/* Soft Glow Behind Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {/* Glassmorphism Compact Container */}
            <div className="relative bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm p-1.5 rounded-xl transition-all duration-300 group-hover:shadow-md group-hover:border-primary/30 group-hover:-translate-y-0.5">
              <img 
                src="/logo.png" 
                alt="Travel Buddy Logo" 
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </button>
              <Link to="/profile" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-destructive/10 text-destructive rounded-xl transition-colors"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </nav>
  );
}
