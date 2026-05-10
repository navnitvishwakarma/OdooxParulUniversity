"use client";

import React from "react";
import FutureLayout from "../../layouts/FutureLayout";
import Globe from "../../components/3d/Globe";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Explore3D() {
  return (
    <FutureLayout>
      <div className="max-w-[1400px] mx-auto">
        {/* Hero Section */}
        <div className="relative w-full rounded-[2.5rem] overflow-hidden mb-12 border border-white/5 bg-gradient-to-br from-black/60 to-[#050B14]/80 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
          {/* Subtle glowing orb behind text */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex flex-col lg:flex-row relative z-20 items-center min-h-[550px]">
            {/* Text Overlay */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="lg:w-1/2 xl:w-5/12 p-8 lg:pl-16 lg:pr-4 lg:py-16 flex flex-col justify-center pointer-events-auto z-30"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold tracking-[0.2em] mb-8 w-max backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                TRAVELOOP NEXT-GEN
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-white mb-6 leading-[1.1] tracking-tighter">
                Discover the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 drop-shadow-lg">
                  Future of Travel
                </span>
              </h1>
              <p className="text-white/60 text-base sm:text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-[420px]">
                Intelligent travel planning powered by immersive analytics and real-time planetary routing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 rounded-2xl bg-cyan-500 text-black font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:-translate-y-1 hover:bg-cyan-400">
                  Begin Exploration
                </button>
                <button className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium tracking-wide transition-all backdrop-blur-md">
                  Watch Demo
                </button>
              </div>
            </motion.div>

            {/* 3D Globe Container */}
            <div className="w-full lg:w-1/2 xl:w-7/12 h-[450px] lg:h-[650px] relative -mt-16 lg:mt-0 opacity-90 hover:opacity-100 transition-opacity duration-700">
              {/* Left edge fade to blend with text */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/60 to-transparent z-20 pointer-events-none hidden lg:block"></div>
              <Globe />
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Active Missions Card */}
          <motion.div variants={cardVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-colors group">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-white/90 m-0">Active Missions</h3>
              <span className="material-symbols-outlined text-cyan-400 group-hover:rotate-45 transition-transform duration-500">rocket_launch</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-cyan-400 font-bold">EU</span>
                </div>
                <div>
                  <h4 className="text-white/90 font-medium m-0">Neo-Tokyo Circuit</h4>
                  <p className="text-white/40 text-sm m-0">T-minus 14 days</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-emerald-400 font-bold">AF</span>
                </div>
                <div>
                  <h4 className="text-white/90 font-medium m-0">Serengeti Safari</h4>
                  <p className="text-white/40 text-sm m-0">Planning Phase</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Planetary Budget Card */}
          <motion.div variants={cardVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-colors group">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-white/90 m-0">Resource Allocation</h3>
              <span className="material-symbols-outlined text-purple-400">account_balance_wallet</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" strokeDasharray="75, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">75%</span>
                  <span className="text-[10px] text-white/40 tracking-wider">UTILIZED</span>
                </div>
              </div>
              <div className="w-full flex justify-between text-sm">
                <span className="text-white/60">Total Budget</span>
                <span className="text-cyan-400 font-bold font-mono">12,500 CR</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Nav Card */}
          <motion.div variants={cardVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-colors flex flex-col">
            <h3 className="text-xl font-medium text-white/90 m-0 mb-6">System Links</h3>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <button className="bg-black/30 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-pointer group">
                <span className="material-symbols-outlined text-white/50 group-hover:text-cyan-400 transition-colors">travel_explore</span>
                <span className="text-xs text-white/70">Destinations</span>
              </button>
              <button className="bg-black/30 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-pointer group">
                <span className="material-symbols-outlined text-white/50 group-hover:text-cyan-400 transition-colors">group</span>
                <span className="text-xs text-white/70">Crew Finder</span>
              </button>
              <button className="bg-black/30 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-pointer group">
                <span className="material-symbols-outlined text-white/50 group-hover:text-cyan-400 transition-colors">shield</span>
                <span className="text-xs text-white/70">Insurance</span>
              </button>
              <button className="bg-black/30 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-pointer group">
                <span className="material-symbols-outlined text-white/50 group-hover:text-cyan-400 transition-colors">history</span>
                <span className="text-xs text-white/70">Logs</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </FutureLayout>
  );
}
