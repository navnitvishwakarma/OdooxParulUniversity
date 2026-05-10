import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div
      className={`
        bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]
        rounded-2xl shadow-[var(--glass-shadow)]
        ${hover ? 'transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
