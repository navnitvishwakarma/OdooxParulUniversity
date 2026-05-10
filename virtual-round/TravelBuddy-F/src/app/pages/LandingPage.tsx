import { Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { GlassCard } from '../components/GlassCard';
import { Sparkles, Globe, Users, CreditCard, MapPin, Star, ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Planning',
      description: 'Let AI create perfect itineraries based on your preferences and budget',
    },
    {
      icon: Globe,
      title: 'Multi-City Routes',
      description: 'Plan complex trips across multiple destinations with ease',
    },
    {
      icon: Users,
      title: 'Collaborate',
      description: 'Invite friends and plan trips together in real-time',
    },
    {
      icon: CreditCard,
      title: 'Smart Budgeting',
      description: 'Track expenses and get AI-powered budget recommendations',
    },
    {
      icon: MapPin,
      title: 'Local Insights',
      description: 'Discover hidden gems and local experiences',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your travel data is encrypted and always secure',
    },
  ];

  const destinations = [
    { name: 'Tokyo, Japan', trips: '12.5K trips', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800' },
    { name: 'Paris, France', trips: '18.2K trips', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
    { name: 'Bali, Indonesia', trips: '9.8K trips', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800' },
    { name: 'New York, USA', trips: '15.4K trips', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800' },
    { name: 'Santorini, Greece', trips: '11.1K trips', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Adventure Traveler',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      text: 'Travel Buddy transformed how I plan trips. The AI suggestions are incredibly accurate!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Digital Nomad',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      text: 'Best travel planning app I\'ve used. The budget tracking feature alone is worth it.',
      rating: 5,
    },
    {
      name: 'Emma Williams',
      role: 'Travel Blogger',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      text: 'Collaborative planning with my friends has never been easier. Absolutely love it!',
      rating: 5,
    },
  ];

  const stats = [
    { value: '500K+', label: 'Happy Travelers' },
    { value: '2M+', label: 'Trips Planned' },
    { value: '180+', label: 'Countries' },
    { value: '4.9/5', label: 'User Rating' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">AI-Powered Travel Planning</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent leading-tight">
              Plan Your Dream<br />Journey with AI
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Create perfect multi-city itineraries, manage budgets, and collaborate with friends.
              Your intelligent travel companion for unforgettable adventures.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                to="/auth"
                className="group bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-xl text-white text-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                Plan Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 rounded-xl border border-border hover:bg-black/5 transition-all text-lg text-foreground">
                Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <GlassCard key={index} className="p-6 text-center">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">Powerful features for modern travelers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassCard hover className="p-8 h-full">
                    <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-xl w-fit mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="destinations" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Popular Destinations</h2>
            <p className="text-xl text-muted-foreground">Explore the world's most loved places</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {destinations.map((dest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard hover className="overflow-hidden group">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-lg mb-1 text-white">{dest.name}</h3>
                      <p className="text-sm text-gray-300">{dest.trips}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Loved by Travelers</h2>
            <p className="text-xl text-muted-foreground">See what our community is saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <GlassCard key={index} className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Your Adventure?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of travelers planning their dream trips with Travel Buddy
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-xl text-white text-lg hover:opacity-90 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      <footer className="border-t border-border py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="Travel Buddy Logo" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your intelligent travel companion for unforgettable adventures.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Features</div>
                <div>Pricing</div>
                <div>Mobile App</div>
                <div>Integrations</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Press</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Help Center</div>
                <div>Community</div>
                <div>Contact</div>
                <div>Privacy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2026 Travel Buddy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
