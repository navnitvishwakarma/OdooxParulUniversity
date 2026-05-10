"use client";

import React, { useState, useEffect } from "react";
import FutureLayout from "../../layouts/FutureLayout";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  PlusOutlined, 
  FilterOutlined, 
  SortAscendingOutlined,
  CompassOutlined
} from "@ant-design/icons";
import { Skeleton, Select, Button } from "antd";
import FutureTripCard, { TripData } from "../../components/future/FutureTripCard";

const MOCK_TRIPS: TripData[] = [
  {
    id: "trip-001",
    title: "Lunar Base Alpha Tour",
    destination: "Moon Sector 4",
    startDate: "2042-08-15",
    endDate: "2042-08-25",
    stopsCount: 3,
    budget: "$45,000",
    status: "Upcoming",
    coverUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2000&auto=format&fit=crop",
    travelers: [
      "https://api.dicebear.com/7.x/notionists/svg?seed=Alex",
      "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah"
    ],
    progress: 15
  },
  {
    id: "trip-002",
    title: "Neo-Tokyo Cyber Walk",
    destination: "Earth / Japan",
    startDate: "2026-11-01",
    endDate: "2026-11-14",
    stopsCount: 8,
    budget: "$8,500",
    status: "Ongoing",
    coverUrl: "https://images.unsplash.com/photo-1542051842857-cb4ad421c469?q=80&w=2000&auto=format&fit=crop",
    travelers: [
      "https://api.dicebear.com/7.x/notionists/svg?seed=Alex",
      "https://api.dicebear.com/7.x/notionists/svg?seed=John",
      "https://api.dicebear.com/7.x/notionists/svg?seed=Mia"
    ],
    progress: 45
  },
  {
    id: "trip-003",
    title: "Mars Colony Research",
    destination: "Mars Olympus",
    startDate: "2045-02-10",
    endDate: "2045-06-20",
    stopsCount: 2,
    budget: "$120,000",
    status: "Upcoming",
    coverUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop",
    travelers: [
      "https://api.dicebear.com/7.x/notionists/svg?seed=Alex",
    ],
    progress: 0
  },
  {
    id: "trip-004",
    title: "Europa Ice Drilling Retreat",
    destination: "Jupiter Orbit",
    startDate: "2041-12-05",
    endDate: "2042-01-10",
    stopsCount: 5,
    budget: "$250,000",
    status: "Completed",
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
    travelers: [
      "https://api.dicebear.com/7.x/notionists/svg?seed=Alex",
      "https://api.dicebear.com/7.x/notionists/svg?seed=Crew1",
      "https://api.dicebear.com/7.x/notionists/svg?seed=Crew2",
      "https://api.dicebear.com/7.x/notionists/svg?seed=Crew3",
    ],
    progress: 100
  }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function MyTrips() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<TripData[]>([]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setTrips(MOCK_TRIPS);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <FutureLayout>
      <div className="max-w-[1600px] mx-auto pb-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 bg-[#050B14]/40 p-6 md:p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-bold tracking-[0.2em] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              MISSION LOGS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight m-0">My Trips</h1>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-black/40 p-2 rounded-2xl border border-white/10">
              <Select
                defaultValue="all"
                className="custom-dark-select w-32"
                styles={{ popup: { root: { backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' } } }}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'upcoming', label: 'Upcoming' },
                  { value: 'ongoing', label: 'Ongoing' },
                  { value: 'completed', label: 'Completed' },
                ]}
              />
              <Select
                defaultValue="recent"
                className="custom-dark-select w-36"
                styles={{ popup: { root: { backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' } } }}
                options={[
                  { value: 'recent', label: 'Most Recent' },
                  { value: 'oldest', label: 'Oldest' },
                  { value: 'budget_high', label: 'Highest Budget' },
                ]}
              />
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="large"
              onClick={() => router.push('/trips/create')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-none text-white font-bold rounded-2xl px-8 h-12 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all"
            >
              Create Trip
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 rounded-[2rem] h-[480px] border border-white/5 p-6 flex flex-col">
                <Skeleton active title={false} paragraph={{ rows: 4, width: ['100%', '80%', '100%', '60%'] }} className="mt-auto custom-dark-skeleton" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && trips.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-md"
          >
            <CompassOutlined className="text-8xl text-white/20 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">No expeditions found</h2>
            <p className="text-white/50 mb-8 max-w-md">Your mission log is currently empty. Initialize a new trip to begin tracking your global and orbital coordinates.</p>
            <Button 
              type="primary" 
              size="large"
              onClick={() => router.push('/trips/create')}
              className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 font-bold rounded-xl px-8 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              Initialize First Trip
            </Button>
          </motion.div>
        )}

        {/* Trips Grid */}
        {!loading && trips.length > 0 && (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {trips.map(trip => (
              <motion.div key={trip.id} variants={itemVariants}>
                <FutureTripCard trip={trip} />
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>

      {/* Styles overrides for dark theme ant components */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-dark-select .ant-select-selector {
          background-color: rgba(0, 0, 0, 0.4) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-radius: 0.75rem !important;
          height: 40px !important;
          display: flex;
          align-items: center;
        }
        .custom-dark-select:hover .ant-select-selector {
          border-color: rgba(34, 211, 238, 0.5) !important;
        }
        .custom-dark-select .ant-select-arrow {
          color: rgba(255, 255, 255, 0.5);
        }
        .ant-select-dropdown {
          background-color: #0f172a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .ant-select-item-option {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        .ant-select-item-option-active {
          background-color: rgba(34, 211, 238, 0.1) !important;
        }
        .ant-select-item-option-selected {
          background-color: rgba(34, 211, 238, 0.2) !important;
          color: #22d3ee !important;
        }
        .custom-dark-skeleton .ant-skeleton-content .ant-skeleton-paragraph > li {
          background: rgba(255, 255, 255, 0.1) !important;
        }
      `}} />
    </FutureLayout>
  );
}
