import { GlassCard } from './GlassCard';
import { Cloud, CloudRain, Sun } from 'lucide-react';

export function WeatherWidget() {
  const weatherData = [
    { day: 'Mon', temp: 24, icon: Sun, condition: 'Sunny' },
    { day: 'Tue', temp: 22, icon: Cloud, condition: 'Cloudy' },
    { day: 'Wed', temp: 19, icon: CloudRain, condition: 'Rainy' },
    { day: 'Thu', temp: 23, icon: Sun, condition: 'Sunny' },
    { day: 'Fri', temp: 25, icon: Sun, condition: 'Sunny' },
  ];

  return (
    <GlassCard className="p-6">
      <h3 className="font-bold mb-4">Weather Forecast</h3>
      <div className="mb-4">
        <div className="text-sm text-muted-foreground mb-1">Tokyo, Japan</div>
        <div className="flex items-center gap-3">
          <Sun className="w-12 h-12 text-accent" />
          <div>
            <div className="text-4xl font-bold">24°C</div>
            <div className="text-sm text-muted-foreground">Sunny</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {weatherData.map((day, index) => {
          const Icon = day.icon;
          return (
            <div key={index} className="text-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
              <div className="text-xs text-muted-foreground mb-2">{day.day}</div>
              <Icon className="w-6 h-6 mx-auto mb-2 text-accent" />
              <div className="text-sm font-bold">{day.temp}°</div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
