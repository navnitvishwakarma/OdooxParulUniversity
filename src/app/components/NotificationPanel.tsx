import { GlassCard } from './GlassCard';
import { Bell, User, MapPin, DollarSign, X } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const notifications = [
    {
      icon: User,
      title: 'Sarah invited you to Tokyo Trip',
      time: '5 minutes ago',
      unread: true,
    },
    {
      icon: DollarSign,
      title: 'Budget alert: 85% spent on Paris trip',
      time: '1 hour ago',
      unread: true,
    },
    {
      icon: MapPin,
      title: 'New destination recommendation',
      time: '3 hours ago',
      unread: false,
    },
    {
      icon: Bell,
      title: 'Trip reminder: Tokyo in 15 days',
      time: '1 day ago',
      unread: false,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute top-20 right-8 w-96 pointer-events-auto">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Notifications</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    notification.unread
                      ? 'bg-primary/10 hover:bg-primary/20'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm mb-1">{notification.title}</div>
                      <div className="text-xs text-muted-foreground">{notification.time}</div>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-primary hover:underline">
            Mark all as read
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
