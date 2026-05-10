import { Users } from 'lucide-react';

interface CollaborationIndicatorProps {
  users: Array<{ name: string; image: string; color: string }>;
}

export function CollaborationIndicator({ users }: CollaborationIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {users.map((user, index) => (
          <div
            key={index}
            className="relative"
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>{users.length} collaborating</span>
      </div>
    </div>
  );
}
