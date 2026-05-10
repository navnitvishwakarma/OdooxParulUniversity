import { Outlet } from 'react-router';
import { FloatingGradient } from '../FloatingGradient';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <FloatingGradient />
      <Outlet />
    </div>
  );
}
