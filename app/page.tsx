"use client";

import MainLayout from "../layouts/MainLayout";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function Home() {
  const router = useRouter();

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-container-max mx-auto px-2 sm:px-6 py-4 sm:py-8"
      >
        {/* Greeting & Summary Bento */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <motion.div variants={itemVariants} className="lg:col-span-2 glass-card rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[240px]">
            <div className="relative z-10">
              <span className="text-secondary font-bold text-label-md uppercase tracking-widest mb-2 block">Welcome Back</span>
              <h2 className="text-display-lg font-display-lg text-primary mb-4 m-0">Hello, Alex! 👋</h2>
              <p className="text-body-lg text-on-surface-variant max-w-md m-0">Your next adventure starts in <span className="font-bold text-primary">4 days</span>. Ready for the Swiss Alps?</p>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-surface-container-high to-transparent flex items-center justify-center opacity-50">
              <span className="material-symbols-outlined text-[120px] text-primary/10">flight_takeoff</span>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-headline-sm font-headline-sm text-primary m-0">Recent Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-xl bg-white/50 border border-white/20 hover:bg-white transition-colors cursor-pointer shadow-sm">
                <div className="bg-surface-container-high p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-sm">chat_bubble</span>
                </div>
                <div>
                  <p className="text-body-sm font-semibold m-0">Sarah joined 'Iceland Roadtrip'</p>
                  <p className="text-xs text-on-surface-variant/70 m-0 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-xl bg-white/50 border border-white/20 hover:bg-white transition-colors cursor-pointer shadow-sm">
                <div className="bg-status-included p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-sm">hotel</span>
                </div>
                <div>
                  <p className="text-body-sm font-semibold m-0">Price drop: Zurich Boutique Hotel</p>
                  <p className="text-xs text-on-surface-variant/70 m-0 mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
            <button className="mt-auto text-primary font-bold text-label-md hover:underline flex items-center gap-2 border-none bg-transparent p-0">
                View All <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </motion.div>
        </section>

        {/* Upcoming Trips (High-Contrast Layered Cards) */}
        <section className="mb-12">
          <motion.div variants={itemVariants} className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-headline-lg font-headline-lg text-primary m-0">My Upcoming Trips</h2>
              <p className="text-body-md text-on-surface-variant m-0 mt-1">Manage your confirmed bookings and itineraries.</p>
            </div>
            <button 
              onClick={() => router.push('/trips')}
              className="bg-primary text-white font-bold px-6 py-2 rounded-lg three-d-lift border-none hidden sm:block"
            >
              Manage All
            </button>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div variants={itemVariants} className="three-d-lift glass-card rounded-2xl overflow-hidden group cursor-pointer" onClick={() => router.push('/packing')}>
              <div className="h-48 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Swiss Alps" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwEnpX-zkZ_X0Na-FXh2Hgehl79ubJ7RiJ-c93NeFw5xyIjQk3Bl4x-gcLKdY1AFJ7IXmUv-2C2W5w9Ab0Ffw8RsxhBhsDhNEdegc4NZ6wLDYqasbEKOfMeZFnlIXlGtN0wTLcm7THDf5jkBBaWVr4twWmDfe9FQ1XgtCndAknzJMDja5lsIr3ZQfl5FeWbGLAALZcPg2665wpltwfFmDDiXBa3oHKkIAPdkFN606KySZqggy8s5rkeW6YFQrhlibTXG-2odI8UoY" />
                <div className="absolute top-4 right-4 bg-secondary text-white text-label-xs px-3 py-1 rounded-full uppercase font-bold active-red-glow">
                  Confirmed
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-headline-sm font-headline-sm text-primary m-0">Swiss Alps Explorer</h3>
                  <span className="text-label-md text-secondary font-bold">Jan 12 - 19</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant mb-6">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span className="text-body-sm">Zermatt & St. Moritz</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-status-included flex items-center justify-center text-[10px] font-bold text-primary">AB</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold">ME</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-primary">+2</div>
                  </div>
                  <span className="text-label-md font-bold text-primary">4 Buddies</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={itemVariants} className="three-d-lift glass-card rounded-2xl overflow-hidden group cursor-pointer" onClick={() => router.push('/trips')}>
              <div className="h-48 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Dubai" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx1Bt2S4ojMK7HzTOjOAL97fKT-5LbkRQVdK4mmy2DlfRoVvUTmKQ62NaYmdvYhkjs2jJO75mxNa4KmUxRv5HpKdGlbr9V99veV9X3_hGPEShV6SgYIUh0SIqYsclbAO76mJrtX7W6ulkSufC3ghd97buOzUkIplU2iBKf1Y17iKDPblNmUMAPKiv2wXhAG7jZkim7hSRxr72M0dn7_pXlFY_60t95NmVLhlYrvP_4qIZGYL3R47CLTtSQaTLcCP2TQWnkAJJYAPk" />
                <div className="absolute top-4 right-4 bg-status-included text-primary text-label-xs px-3 py-1 rounded-full uppercase font-bold">
                  Planning
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-headline-sm font-headline-sm text-primary m-0">Dubai Luxury Week</h3>
                  <span className="text-label-md text-on-surface-variant font-bold">Feb 05 - 12</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant mb-6">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span className="text-body-sm">Downtown Dubai</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold">ME</div>
                  </div>
                  <span className="text-label-md font-bold text-on-surface-variant italic">Solo Trip</span>
                </div>
              </div>
            </motion.div>

            {/* Add New Card */}
            <motion.div variants={itemVariants} onClick={() => router.push('/trips/create')} className="border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center p-8 group hover:border-primary/50 transition-colors cursor-pointer min-h-[360px] bg-white/30 hover:bg-white/50 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">add</span>
              </div>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-2 m-0">Plan a New Trip</h3>
              <p className="text-body-sm text-on-surface-variant text-center max-w-[200px] m-0">Create a custom itinerary or browse community trips.</p>
            </motion.div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="mb-12">
          <motion.div variants={itemVariants}>
            <h2 className="text-headline-md font-headline-md text-primary mb-6 m-0">Quick Actions</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.button variants={itemVariants} className="glass-card p-6 rounded-xl flex flex-col items-center gap-3 three-d-lift border-none cursor-pointer">
              <span className="material-symbols-outlined text-secondary text-3xl">travel_explore</span>
              <span className="text-label-md font-bold text-primary">Explore Dest.</span>
            </motion.button>
            <motion.button variants={itemVariants} onClick={() => router.push('/community')} className="glass-card p-6 rounded-xl flex flex-col items-center gap-3 three-d-lift border-none cursor-pointer">
              <span className="material-symbols-outlined text-primary text-3xl">person_add</span>
              <span className="text-label-md font-bold text-primary">Find Buddies</span>
            </motion.button>
            <motion.button variants={itemVariants} onClick={() => router.push('/trips')} className="glass-card p-6 rounded-xl flex flex-col items-center gap-3 three-d-lift border-none cursor-pointer">
              <span className="material-symbols-outlined text-primary text-3xl">confirmation_number</span>
              <span className="text-label-md font-bold text-primary">My Bookings</span>
            </motion.button>
            <motion.button variants={itemVariants} onClick={() => router.push('/budget')} className="glass-card p-6 rounded-xl flex flex-col items-center gap-3 three-d-lift border-none cursor-pointer">
              <span className="material-symbols-outlined text-primary text-3xl">paid</span>
              <span className="text-label-md font-bold text-primary">Expense Track</span>
            </motion.button>
          </div>
        </section>

        {/* Trip Inspiration (Carousel-style Bento) */}
        <section>
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
            <h2 className="text-headline-lg font-headline-lg text-primary m-0">Recommended for You</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-full border border-outline-variant hover:bg-surface-container transition-colors bg-white cursor-pointer">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-2 rounded-full border border-outline-variant hover:bg-surface-container transition-colors bg-white cursor-pointer">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="md:col-span-2 glass-card rounded-2xl overflow-hidden relative h-[400px] group cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Hidden Maldives" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRXitQvFSjnGBDzXJRW8QL94mRjh0J4HGTUTdMFh9P6SoR7ffqJIqB0VRC-nWDXrjGBpRTwMVymGccEKavjR4eXWvSqnXvsle6oqhTtu7W6r7RlG-fEwkc2531B9gw0DfXxv452Z9GkxwLxGotLi3jQtYf9jH-uAKVdU2c7EKYR39GVh6oGn7DAsG1_vP4lfoP_f_OIACcIF1Zq36x8mgZdbkSH_eLpuTlkymYqolMAHKIjoMj2x-2USst8ZIXtJwxtNug_8zT34U" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <span className="bg-secondary text-white px-3 py-1 rounded-md text-label-xs font-bold mb-4 inline-block">TRENDING</span>
                <h3 className="text-display-lg text-white font-display-lg mb-2 m-0">Hidden Maldives</h3>
                <p className="text-white/80 text-body-lg mb-6 max-w-lg m-0 mt-2">Discover private atolls and underwater dining experiences curated by our expert buddies.</p>
                <button className="bg-white text-primary px-8 py-3 rounded-lg font-bold three-d-lift border-none cursor-pointer">Join Trip</button>
              </div>
            </motion.div>
            <div className="flex flex-col gap-6">
              <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 h-full flex flex-col justify-between group cursor-pointer overflow-hidden relative">
                <div className="relative z-10">
                  <h4 className="text-headline-sm font-headline-sm text-primary mb-2 m-0">Tokyo Neon Nights</h4>
                  <p className="text-body-sm text-on-surface-variant m-0 mt-1">A 5-day cultural deep dive into the heart of Japan.</p>
                </div>
                <div className="mt-4 flex items-center justify-between relative z-10">
                  <span className="text-secondary font-bold text-label-md">$1,250 / pp</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-[100px]">temple_buddhist</span>
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 h-full flex flex-col justify-between group cursor-pointer overflow-hidden relative">
                <div className="relative z-10">
                  <h4 className="text-headline-sm font-headline-sm text-primary mb-2 m-0">Safari in Kenya</h4>
                  <p className="text-body-sm text-on-surface-variant m-0 mt-1">Witness the great migration with expert local guides.</p>
                </div>
                <div className="mt-4 flex items-center justify-between relative z-10">
                  <span className="text-secondary font-bold text-label-md">$2,800 / pp</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-[100px]">nature</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </motion.div>
    </MainLayout>
  );
}