"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  DollarOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined
} from "@ant-design/icons";
import { message } from "antd";

export interface TripData {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  stopsCount: number;
  budget: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  coverUrl: string;
  travelers: string[];
  progress: number;
}

export default function FutureTripCard({ trip }: { trip: TripData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Upcoming": return "text-cyan-400 bg-cyan-400/10 border-cyan-400/30";
      case "Ongoing": return "text-green-400 bg-green-400/10 border-green-400/30";
      case "Completed": return "text-purple-400 bg-purple-400/10 border-purple-400/30";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    message.success({
      content: `Expedition ${trip.title} successfully purged from database.`,
      className: 'custom-message',
      style: { marginTop: '10vh' }
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full rounded-[2rem] h-[480px] bg-[#050B14]/80 backdrop-blur-2xl border border-white/10 overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_rgba(34,211,238,0.2)] transition-shadow duration-500 cursor-pointer"
    >
      {/* Background Cover Image with Gradient Fade */}
      <div 
        className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500 bg-cover bg-center"
        style={{ backgroundImage: `url(${trip.coverUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/80 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div 
        className="relative z-10 p-6 h-full flex flex-col"
        style={{ transform: "translateZ(50px)" }} // Pop out text for 3D effect
      >
        {/* Top Row: Status Badge & Travelers */}
        <div className="flex justify-between items-start mb-auto">
          <div className={`px-3 py-1 rounded-full border text-xs font-bold tracking-widest uppercase ${getStatusColor(trip.status)} backdrop-blur-md`}>
            {trip.status}
          </div>
          
          <div className="flex -space-x-2">
            {trip.travelers.map((avatar, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050B14] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt="Traveler" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Middle Info */}
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-cyan-300 transition-colors">
            {trip.title}
          </h3>
          <div className="flex items-center text-white/60 mb-4 font-medium">
            <EnvironmentOutlined className="mr-2 text-cyan-400" />
            {trip.destination} • {trip.stopsCount} Stops
          </div>

          {/* Dates & Budget Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 border border-white/5 rounded-xl p-3 backdrop-blur-md">
              <div className="text-xs text-white/40 mb-1 flex items-center">
                <CalendarOutlined className="mr-1" /> TIMEFRAME
              </div>
              <div className="text-sm text-white/90 font-medium">
                {trip.startDate}<br/><span className="text-white/40">to</span> {trip.endDate}
              </div>
            </div>
            <div className="bg-black/30 border border-white/5 rounded-xl p-3 backdrop-blur-md">
              <div className="text-xs text-white/40 mb-1 flex items-center">
                <DollarOutlined className="mr-1" /> ALLOCATED
              </div>
              <div className="text-lg text-cyan-400 font-bold">
                {trip.budget}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions & Progress */}
        <div className="mt-auto">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-white/60 mb-2 font-medium tracking-wide">
              <span>MISSION PROGRESS</span>
              <span>{trip.progress}%</span>
            </div>
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 relative"
                style={{ width: `${trip.progress}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-sm animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between border-t border-white/10 pt-4">
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 flex items-center justify-center text-white hover:text-cyan-400 transition-all group/btn">
                <EyeOutlined className="group-hover/btn:scale-110 transition-transform" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 flex items-center justify-center text-white hover:text-blue-400 transition-all group/btn">
                <EditOutlined className="group-hover/btn:scale-110 transition-transform" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/50 flex items-center justify-center text-white hover:text-indigo-400 transition-all group/btn">
                <ShareAltOutlined className="group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
            <button 
              onClick={handleDelete}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 flex items-center justify-center text-white hover:text-red-400 transition-all group/btn"
            >
              <DeleteOutlined className="group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
