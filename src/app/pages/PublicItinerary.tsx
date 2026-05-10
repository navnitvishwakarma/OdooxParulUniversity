import { GlassCard } from '../components/GlassCard';
import { MapPin, Calendar, DollarSign, Clock, Share2, Download, Heart, User } from 'lucide-react';

export function PublicItinerary() {
  const tripData = {
    title: 'Amazing Tokyo Adventure',
    author: 'Sarah Johnson',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
    dates: 'June 15 - 25, 2026',
    duration: '11 days',
    budget: '$3,500',
    travelers: 2,
    likes: 1247,
    saves: 823,
  };

  const days = [
    {
      day: 1,
      date: 'June 15, 2026',
      activities: [
        { time: '10:00 AM', title: 'Arrival at Tokyo Narita Airport', type: 'Travel' },
        { time: '1:00 PM', title: 'Check-in at Hotel in Shibuya', type: 'Accommodation' },
        { time: '3:00 PM', title: 'Explore Shibuya Crossing', type: 'Sightseeing' },
        { time: '7:00 PM', title: 'Dinner at Ichiran Ramen', type: 'Food' },
      ],
    },
    {
      day: 2,
      date: 'June 16, 2026',
      activities: [
        { time: '9:00 AM', title: 'Visit Senso-ji Temple', type: 'Sightseeing' },
        { time: '12:00 PM', title: 'Lunch at Tsukiji Market', type: 'Food' },
        { time: '3:00 PM', title: 'Tokyo Skytree Visit', type: 'Sightseeing' },
        { time: '7:00 PM', title: 'Dinner in Asakusa', type: 'Food' },
      ],
    },
    {
      day: 3,
      date: 'June 17, 2026',
      activities: [
        { time: '7:00 AM', title: 'Day Trip to Mount Fuji', type: 'Nature' },
        { time: '12:00 PM', title: 'Lunch at Kawaguchiko', type: 'Food' },
        { time: '3:00 PM', title: 'Explore Fuji Five Lakes', type: 'Nature' },
        { time: '8:00 PM', title: 'Return to Tokyo', type: 'Travel' },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative h-96 overflow-hidden">
        <img
          src={tripData.coverImage}
          alt={tripData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">{tripData.title}</h1>
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {tripData.dates}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {tripData.duration}
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {tripData.budget}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <img
                  src={tripData.authorImage}
                  alt={tripData.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold">Created by {tripData.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {tripData.likes.toLocaleString()} likes · {tripData.saves.toLocaleString()} saves
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {days.map((day) => (
                <div key={day.day}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-primary to-secondary w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold">
                      {day.day}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Day {day.day}</h2>
                      <p className="text-muted-foreground">{day.date}</p>
                    </div>
                  </div>

                  <div className="space-y-3 ml-16">
                    {day.activities.map((activity, index) => (
                      <GlassCard key={index} className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="text-sm text-muted-foreground min-w-[80px]">
                            {activity.time}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold mb-1">{activity.title}</h3>
                            <div className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                              {activity.type}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6 sticky top-8">
              <h3 className="font-bold mb-4">Trip Overview</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-bold">{tripData.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-bold text-accent">{tripData.budget}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Travelers</span>
                  <span className="font-bold">{tripData.travelers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Activities</span>
                  <span className="font-bold">24</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-primary to-secondary py-3 rounded-xl text-white hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Save Trip
                </button>
                <button className="w-full border border-border py-3 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button className="w-full border border-border py-3 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Export PDF
                </button>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-bold mb-4">Map Preview</h3>
              <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                Interactive map coming soon
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
