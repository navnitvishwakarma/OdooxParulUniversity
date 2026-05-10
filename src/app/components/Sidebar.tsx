import { Link, useLocation } from 'react-router';
import { LayoutDashboard, PlusCircle, Map, DollarSign, Search, Package, User, Settings } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: PlusCircle, label: 'Create Trip', path: '/create-trip' },
    { icon: Map, label: 'My Trips', path: '/itinerary/1' },
    { icon: Search, label: 'Explore', path: '/activities' },
    { icon: DollarSign, label: 'Budget', path: '/budget' },
    { icon: Package, label: 'Packing', path: '/packing' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--sidebar)] backdrop-blur-xl border-r border-[var(--sidebar-border)] pt-20">
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
