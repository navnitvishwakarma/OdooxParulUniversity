import { GlassCard } from './GlassCard';
import { Sparkles } from 'lucide-react';

interface AIInsightCardProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function AIInsightCard({ title, description, action }: AIInsightCardProps) {
  return (
    <GlassCard className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
      <div className="flex items-start gap-3">
        <div className="bg-gradient-to-br from-primary to-secondary p-2.5 rounded-xl flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm text-primary hover:underline"
            >
              {action.label} →
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
