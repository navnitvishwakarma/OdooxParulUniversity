import { Users, X } from 'lucide-react';
import { useState } from 'react';

interface CollaborationIndicatorProps {
  users: Array<{ name: string; image: string; color: string }>;
  onRemove?: (index: number) => void;
}

export function CollaborationIndicator({ users, onRemove }: CollaborationIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative flex items-center gap-3 cursor-pointer group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex -space-x-2">
        {users.map((user, index) => (
          <div
            key={index}
            className="relative transition-transform group-hover:translate-y-[-2px]"
            title={user.name}
          >
            <img
              src={user.image}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-background object-cover"
            />
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background"
              style={{ backgroundColor: user.color }}
            ></div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <Users className="w-4 h-4" />
        <span>{users.length} collaborating</span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl p-3 z-50">
          <h4 className="font-bold text-sm mb-3 px-2">Current Collaborators</h4>
          <div className="space-y-2">
            {users.map((user, index) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors group/item">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
                {onRemove && user.name !== 'You' ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(index); }} 
                    className="p-1 opacity-0 group-hover/item:opacity-100 hover:text-destructive transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: user.color }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
