import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { CollaborationIndicator } from '../components/CollaborationIndicator';
import { MapPin, Plus, Clock, DollarSign, Users, Share2, Edit, Trash2, GripVertical } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  time: string;
  duration: string;
  cost: string;
  type: string;
}

interface Day {
  id: string;
  date: string;
  activities: Activity[];
}

function DraggableActivity({ activity, index, moveActivity }: any) {
  const [{ isDragging }, drag] = useDrag({
    type: 'activity',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'activity',
    hover: (item: any) => {
      if (item.index !== index) {
        moveActivity(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <GlassCard className="p-4 mb-3 cursor-move hover:bg-white/10 transition-all">
        <div className="flex items-start gap-4">
          <GripVertical className="w-5 h-5 text-muted-foreground mt-1" />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold mb-1">{activity.title}</h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {activity.cost}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
              {activity.type}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export function ItineraryBuilder() {
  const [days, setDays] = useState<Day[]>([
    {
      id: '1',
      date: 'June 15, 2026',
      activities: [
        { id: '1', title: 'Arrival at Tokyo Narita Airport', time: '10:00 AM', duration: '2h', cost: '$0', type: 'Travel' },
        { id: '2', title: 'Check-in at Hotel', time: '1:00 PM', duration: '1h', cost: '$0', type: 'Accommodation' },
        { id: '3', title: 'Explore Shibuya Crossing', time: '3:00 PM', duration: '2h', cost: '$20', type: 'Sightseeing' },
        { id: '4', title: 'Dinner at Ichiran Ramen', time: '7:00 PM', duration: '1.5h', cost: '$15', type: 'Food' },
      ],
    },
    {
      id: '2',
      date: 'June 16, 2026',
      activities: [
        { id: '5', title: 'Visit Senso-ji Temple', time: '9:00 AM', duration: '2h', cost: '$0', type: 'Sightseeing' },
        { id: '6', title: 'Lunch at Tsukiji Market', time: '12:00 PM', duration: '1.5h', cost: '$30', type: 'Food' },
        { id: '7', title: 'Tokyo Skytree Visit', time: '3:00 PM', duration: '2h', cost: '$25', type: 'Sightseeing' },
      ],
    },
  ]);

  const moveActivity = (dayIndex: number, fromIndex: number, toIndex: number) => {
    const newDays = [...days];
    const [removed] = newDays[dayIndex].activities.splice(fromIndex, 1);
    newDays[dayIndex].activities.splice(toIndex, 0, removed);
    setDays(newDays);
  };

  const collaborators = [
    { name: 'You', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', color: '#4F46E5' },
    { name: 'Sarah', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', color: '#06B6D4' },
    { name: 'Mike', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', color: '#F97316' },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen">
        <Navbar />
        <Sidebar />

        <main className="ml-64 px-8 pb-8 pt-28">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Tokyo Adventure</h1>
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground">June 15 - 25, 2026</p>
                  <CollaborationIndicator users={collaborators} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-white/5 transition-all">
                  <Users className="w-5 h-5" />
                  Invite
                </button>
                <button className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-2 rounded-xl text-white hover:opacity-90 transition-all">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {days.map((day, dayIndex) => (
                  <div key={day.id}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">Day {dayIndex + 1}</h2>
                      <span className="text-muted-foreground">{day.date}</span>
                    </div>

                    <div className="mb-4">
                      {day.activities.map((activity, actIndex) => (
                        <DraggableActivity
                          key={activity.id}
                          activity={activity}
                          index={actIndex}
                          moveActivity={(from: number, to: number) => moveActivity(dayIndex, from, to)}
                        />
                      ))}
                    </div>

                    <button className="w-full border-2 border-dashed border-border rounded-xl py-4 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                      <Plus className="w-5 h-5" />
                      Add Activity
                    </button>
                  </div>
                ))}

                <button className="w-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl py-4 hover:opacity-80 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Day
                </button>
              </div>

              <div className="space-y-6">
                <GlassCard className="overflow-hidden">
                  <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground text-center">Map view coming soon</p>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4">Trip Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Days</span>
                      <span className="font-bold">11 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Activities</span>
                      <span className="font-bold">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Estimated Cost</span>
                      <span className="font-bold text-accent">$3,450</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Collaborators</span>
                      <span className="font-bold">3</span>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4">Quick Add</h3>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all">
                      + Sightseeing
                    </button>
                    <button className="w-full px-4 py-2 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-all">
                      + Restaurant
                    </button>
                    <button className="w-full px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-all">
                      + Activity
                    </button>
                    <button className="w-full px-4 py-2 bg-purple-500/20 text-purple-500 rounded-lg hover:bg-purple-500/30 transition-all">
                      + Accommodation
                    </button>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  );
}
