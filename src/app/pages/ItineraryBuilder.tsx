import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { GlassCard } from '../components/GlassCard';
import { CollaborationIndicator } from '../components/CollaborationIndicator';
import { MapPin, Plus, Clock, DollarSign, Users, Share2, Edit, Trash2, GripVertical, Sparkles, Check } from 'lucide-react';

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

function DraggableActivity({ activity, index, moveActivity, onDelete, onUpdate, onHover }: any) {
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

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(activity);

  useEffect(() => {
    setEditData(activity);
  }, [activity]);

  const handleSave = () => {
    if (onUpdate) onUpdate(editData);
    setIsEditing(false);
  };

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }} onMouseEnter={() => onHover && onHover(activity)}>
      <GlassCard className="p-4 mb-3 cursor-move hover:bg-white/10 transition-all">
        <div className="flex items-start gap-4">
          <GripVertical className="w-5 h-5 text-muted-foreground mt-1" />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="w-full pr-4">
                {isEditing ? (
                  <div className="space-y-2 w-full mb-2">
                    <input 
                      type="text" 
                      value={editData.title} 
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="w-full bg-black/50 border border-border rounded-lg px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex gap-2 text-sm">
                      <input type="text" value={editData.time} onChange={(e) => setEditData({...editData, time: e.target.value})} className="w-1/3 bg-black/50 border border-border rounded-lg px-2 py-1 focus:outline-none" placeholder="Time" />
                      <input type="text" value={editData.duration} onChange={(e) => setEditData({...editData, duration: e.target.value})} className="w-1/3 bg-black/50 border border-border rounded-lg px-2 py-1 focus:outline-none" placeholder="Duration" />
                      <input type="text" value={editData.cost} onChange={(e) => setEditData({...editData, cost: e.target.value})} className="w-1/3 bg-black/50 border border-border rounded-lg px-2 py-1 focus:outline-none" placeholder="Cost" />
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button onClick={handleSave} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-green-500">
                    <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                <button onClick={onDelete} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {!isEditing && (
              <div className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                {activity.type}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export function ItineraryBuilder() {
  const [tripInfo, setTripInfo] = useState({
    name: 'Tokyo Adventure',
    destination: 'Tokyo, Japan',
    startDate: '2026-06-15',
    endDate: '2026-06-25',
    isAiGenerated: false
  });

  const [activeMapQuery, setActiveMapQuery] = useState(tripInfo.destination);

  useEffect(() => {
    const savedTrip = localStorage.getItem('travel_buddy_current_trip');
    if (savedTrip) {
      const parsed = JSON.parse(savedTrip);
      setTripInfo({
        name: parsed.name,
        destination: parsed.destination,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        isAiGenerated: parsed.isAiGenerated
      });
      setActiveMapQuery(parsed.destination);

      if (parsed.isAiGenerated && parsed.startDate && parsed.endDate) {
        // Generate dynamic days based on dates
        const start = new Date(parsed.startDate);
        const end = new Date(parsed.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1); // inclusive
        
        const generatedDays: Day[] = [];
        for (let i = 0; i < diffDays; i++) {
          const current = new Date(start);
          current.setDate(current.getDate() + i);
          const dateStr = current.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          
          generatedDays.push({
            id: `day-${i+1}`,
            date: dateStr,
            activities: [
              { id: `act-${i}-1`, title: `Morning exploration in ${parsed.destination}`, time: '09:00 AM', duration: '3h', cost: '$15', type: 'Sightseeing' },
              { id: `act-${i}-2`, title: `Local Lunch in ${parsed.destination}`, time: '12:30 PM', duration: '1.5h', cost: '$25', type: 'Food' },
              { id: `act-${i}-3`, title: `Afternoon Cultural Tour`, time: '02:30 PM', duration: '2h', cost: '$30', type: 'Activity' },
              { id: `act-${i}-4`, title: `Dinner & Evening Walk`, time: '07:00 PM', duration: '2h', cost: '$40', type: 'Food' }
            ]
          });
        }
        setDays(generatedDays);
      }
    }
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
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

  const deleteActivity = (dayIndex: number, activityId: string) => {
    const newDays = [...days];
    newDays[dayIndex].activities = newDays[dayIndex].activities.filter(a => a.id !== activityId);
    setDays(newDays);
  };

  const updateActivity = (dayIndex: number, activityId: string, updatedActivity: Activity) => {
    const newDays = [...days];
    const actIndex = newDays[dayIndex].activities.findIndex(a => a.id === activityId);
    if (actIndex !== -1) {
      newDays[dayIndex].activities[actIndex] = updatedActivity;
      setDays(newDays);
    }
  };

  const addActivity = (dayIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].activities.push({
      id: `new-${Date.now()}`,
      title: 'New Activity',
      time: '12:00 PM',
      duration: '1h',
      cost: '$0',
      type: 'Activity'
    });
    setDays(newDays);
  };

  const addDay = () => {
    const newDays = [...days];
    let nextDateStr = `Day ${newDays.length + 1}`;
    
    if (newDays.length > 0) {
      const lastDate = newDays[newDays.length - 1].date;
      const parsedLastDate = new Date(lastDate);
      if (!isNaN(parsedLastDate.getTime())) {
        parsedLastDate.setDate(parsedLastDate.getDate() + 1);
        nextDateStr = parsedLastDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
    } else if (tripInfo.startDate) {
      const startDate = new Date(tripInfo.startDate);
      nextDateStr = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    newDays.push({
      id: `day-${Date.now()}`,
      date: nextDateStr,
      activities: []
    });
    setDays(newDays);
  };

  const handleQuickAdd = (type: string, title: string) => {
    if (days.length === 0) return;
    const newDays = [...days];
    newDays[0].activities.push({
      id: `quick-${Date.now()}`,
      title: title,
      time: '10:00 AM',
      duration: '1h',
      cost: '$0',
      type: type
    });
    setDays(newDays);
  };

  const [collaborators, setCollaborators] = useState([
    { name: 'You', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', color: '#4F46E5' },
    { name: 'Sarah', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', color: '#06B6D4' },
    { name: 'Mike', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', color: '#F97316' },
  ]);

  const [isCopied, setIsCopied] = useState(false);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      setInviteSent(true);
      setTimeout(() => {
        setCollaborators([...collaborators, {
          name: inviteEmail.split('@')[0],
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(inviteEmail)}&background=random`,
          color: '#8B5CF6'
        }]);
        setIsInviteOpen(false);
        setInviteSent(false);
        setInviteEmail('');
      }, 1500);
    }
  };

  const totalDays = days.length;
  const totalActivities = days.reduce((acc, day) => acc + day.activities.length, 0);
  const totalCost = days.reduce((acc, day) => {
    return acc + day.activities.reduce((sum, act) => {
      const costStr = act.cost.replace(/[^0-9.-]+/g, "");
      return sum + (parseFloat(costStr) || 0);
    }, 0);
  }, 0);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen">
        <Navbar />
        <Sidebar />

        <main className="ml-64 pt-20 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                  {tripInfo.name}
                  {tripInfo.isAiGenerated && (
                    <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Generated
                    </span>
                  )}
                </h1>
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground">
                    {formatDate(tripInfo.startDate)} - {formatDate(tripInfo.endDate)}
                  </p>
                  <CollaborationIndicator 
                    users={collaborators} 
                    onRemove={(index) => {
                      const newCollabs = [...collaborators];
                      newCollabs.splice(index, 1);
                      setCollaborators(newCollabs);
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 relative">
                <div className="relative">
                  <button 
                    onClick={() => setIsInviteOpen(!isInviteOpen)}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-white/5 transition-all"
                  >
                    <Users className="w-5 h-5" />
                    Invite
                  </button>
                  {isInviteOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-[#1A1A1A] border border-border rounded-xl shadow-2xl p-4 z-50">
                      {inviteSent ? (
                        <div className="flex flex-col items-center justify-center py-4 text-green-500">
                          <Check className="w-8 h-8 mb-2" />
                          <p className="font-medium">Invite Sent!</p>
                        </div>
                      ) : (
                        <form onSubmit={handleInvite}>
                          <h3 className="font-bold mb-3 text-white">Invite Collaborator</h3>
                          <input 
                            type="email" 
                            required
                            placeholder="friend@example.com" 
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="w-full bg-black/50 border border-border rounded-lg px-3 py-2 text-sm mb-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button type="submit" className="w-full bg-primary text-white rounded-lg py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                            Send Invite
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-6 py-2 rounded-xl text-white hover:opacity-90 transition-all w-[120px] justify-center"
                >
                  {isCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                  {isCopied ? "Copied!" : "Share"}
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
                          onDelete={() => deleteActivity(dayIndex, activity.id)}
                          onUpdate={(updated: Activity) => updateActivity(dayIndex, activity.id, updated)}
                          onHover={(hovered: Activity) => setActiveMapQuery(`${hovered.title}, ${tripInfo.destination}`)}
                        />
                      ))}
                    </div>

                    <button 
                      onClick={() => addActivity(dayIndex)}
                      className="w-full border-2 border-dashed border-border rounded-xl py-4 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="w-5 h-5" />
                      Add Activity
                    </button>
                  </div>
                ))}

                <button 
                  onClick={addDay}
                  className="w-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl py-4 hover:opacity-80 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Day
                </button>
              </div>

              <div className="space-y-6">
                <GlassCard className="overflow-hidden p-0">
                  <div className="h-64 w-full relative">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(activeMapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                  </div>
                  <div className="p-4 bg-card/50 backdrop-blur-md">
                    <p className="text-sm font-medium flex items-center justify-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      {activeMapQuery === tripInfo.destination ? tripInfo.destination : activeMapQuery.split(',')[0]}
                    </p>
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setActiveMapQuery(`Hotels in ${tripInfo.destination}`)} className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full hover:bg-primary/30 transition-colors">Hotels</button>
                      <button onClick={() => setActiveMapQuery(`Restaurants in ${tripInfo.destination}`)} className="px-3 py-1 bg-secondary/20 text-secondary text-xs rounded-full hover:bg-secondary/30 transition-colors">Food</button>
                      <button onClick={() => setActiveMapQuery(`Attractions in ${tripInfo.destination}`)} className="px-3 py-1 bg-accent/20 text-accent text-xs rounded-full hover:bg-accent/30 transition-colors">Attractions</button>
                      <button onClick={() => setActiveMapQuery(tripInfo.destination)} className="px-3 py-1 bg-white/10 text-white text-xs rounded-full hover:bg-white/20 transition-colors">Reset</button>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4">Trip Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Days</span>
                      <span className="font-bold">{totalDays} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Activities</span>
                      <span className="font-bold">{totalActivities}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Estimated Cost</span>
                      <span className="font-bold text-accent">${totalCost}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Collaborators</span>
                      <span className="font-bold">{collaborators.length}</span>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4">Quick Add</h3>
                  <div className="space-y-2">
                    <button onClick={() => handleQuickAdd('Sightseeing', 'New Sightseeing')} className="w-full px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all">
                      + Sightseeing
                    </button>
                    <button onClick={() => handleQuickAdd('Food', 'New Restaurant')} className="w-full px-4 py-2 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-all">
                      + Restaurant
                    </button>
                    <button onClick={() => handleQuickAdd('Activity', 'New Activity')} className="w-full px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-all">
                      + Activity
                    </button>
                    <button onClick={() => handleQuickAdd('Accommodation', 'New Accommodation')} className="w-full px-4 py-2 bg-purple-500/20 text-purple-500 rounded-lg hover:bg-purple-500/30 transition-all">
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
