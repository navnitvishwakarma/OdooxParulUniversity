"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import type { ItineraryStop } from "./StopCard";

interface TripSummaryPanelProps {
  stops: ItineraryStop[];
}

export default function TripSummaryPanel({ stops }: TripSummaryPanelProps) {
  const totalDays = stops.length;
  const totalBudget = stops.reduce((sum, s) => {
    const num = parseFloat(s.budget.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const totalActivities = stops.reduce((sum, s) => sum + s.activities.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-[#0a1628]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl sticky top-28"
    >
      <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Trip Overview</h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-center">
          <CalendarOutlined className="text-cyan-400 text-xl mb-2 block" />
          <div className="text-2xl font-bold text-white">{totalDays}</div>
          <div className="text-[10px] text-white/40 tracking-widest">STOPS</div>
        </div>
        <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-center">
          <EnvironmentOutlined className="text-blue-400 text-xl mb-2 block" />
          <div className="text-2xl font-bold text-white">{totalActivities}</div>
          <div className="text-[10px] text-white/40 tracking-widest">ACTIVITIES</div>
        </div>
        <div className="col-span-2 bg-black/30 border border-white/5 rounded-xl p-4 text-center">
          <DollarOutlined className="text-emerald-400 text-xl mb-2 block" />
          <div className="text-2xl font-bold text-cyan-400">${totalBudget.toLocaleString()}</div>
          <div className="text-[10px] text-white/40 tracking-widest">ESTIMATED TOTAL</div>
        </div>
      </div>

      {/* Timeline Preview */}
      <div className="mb-6">
        <div className="text-xs text-white/40 tracking-widest font-bold mb-3">ROUTE PREVIEW</div>
        <div className="space-y-0">
          {stops.map((stop, i) => (
            <div key={stop.id} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" : "bg-white/20"}`} />
                {i < stops.length - 1 && (
                  <div className="w-px h-6 bg-white/10" />
                )}
              </div>
              <span className="text-sm text-white/70 font-medium py-1">{stop.city}</span>
            </div>
          ))}
          {stops.length === 0 && (
            <div className="text-sm text-white/30 text-center py-4">No stops added</div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-white/40 mb-2">
          <span className="tracking-widest font-bold">COMPLETION</span>
          <span>{Math.min(stops.length * 20, 100)}%</span>
        </div>
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
            style={{ width: `${Math.min(stops.length * 20, 100)}%` }}
          />
        </div>
      </div>

      {/* Export Button */}
      <button className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2">
        <RocketOutlined /> Export Itinerary
      </button>
    </motion.div>
  );
}
