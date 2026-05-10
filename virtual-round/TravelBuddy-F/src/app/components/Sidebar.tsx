import { Link, useLocation, useParams } from 'react-router';
import { useTranslation } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { LayoutDashboard, PlusCircle, Map, DollarSign, Search, Package, User, Users, Settings } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useUser();

  const { id } = useParams();
  
  const navGroups = [
    {
      label: "Overview",
      items: [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), path: '/dashboard' },
        { icon: Users, label: 'Community Trips', path: '/explore' },
        { icon: Search, label: t('sidebar.explore'), path: '/activities' },
      ]
    },
    {
      label: "Planning",
      items: [
        { icon: PlusCircle, label: t('sidebar.createTrip'), path: '/create-trip' },
        { icon: Map, label: t('sidebar.myTrips'), path: '/dashboard' },
        { icon: DollarSign, label: t('sidebar.budget'), path: id ? `/budget/${id}` : '/budget' },
        { icon: Package, label: t('sidebar.packing'), path: id ? `/packing/${id}` : '/packing' },
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white/50 dark:bg-black/20 backdrop-blur-3xl border-r border-black/5 dark:border-white/5 pt-20 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-6">
        <nav className="flex-1 px-4 py-6 space-y-8">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h4 className="px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-3">
                {group.label}
              </h4>
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden
                        ${isActive
                          ? 'text-white font-medium shadow-md shadow-primary/20'
                          : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground font-medium'
                        }
                      `}
                    >
                      {/* Active Gradient Background */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-100"></div>
                      )}
                      
                      {/* Active Left Accent Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                      )}

                      {/* Content */}
                      <div className="relative z-10 flex items-center gap-3 w-full">
                        <Icon className={`w-5 h-5 transition-transform duration-300 ${!isActive && 'group-hover:scale-110 group-hover:text-primary'}`} />
                        <span className="transition-transform duration-300 group-hover:translate-x-1">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Pinned Bottom Section */}
        <div className="px-4 mt-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full mb-4 opacity-50"></div>
          <div className="space-y-1.5">
            <Link
              to="/profile"
              className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground font-medium"
            >
              <div className="w-6 h-6 rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors overflow-hidden shrink-0">
                <img 
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="group-hover:translate-x-1 transition-transform duration-300 truncate">{user.name || t('sidebar.profile')}</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
