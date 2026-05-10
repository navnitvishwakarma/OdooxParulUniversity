"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  DeleteOutlined,
  PlusOutlined,
  HolderOutlined,
  CoffeeOutlined,
  ThunderboltOutlined,
  CameraOutlined,
  ShoppingOutlined,
  StarOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { Tag, Tooltip } from "antd";

export interface Activity {
  id: string;
  name: string;
  category: "Adventure" | "Food" | "Nature" | "Sightseeing" | "Shopping" | "Nightlife";
  duration: string;
  cost: string;
  timeSlot: string;
}

export interface ItineraryStop {
  id: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  notes: string;
  budget: string;
  coverUrl: string;
  activities: Activity[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  Adventure: <ThunderboltOutlined />,
  Food: <CoffeeOutlined />,
  Nature: <StarOutlined />,
  Sightseeing: <CameraOutlined />,
  Shopping: <ShoppingOutlined />,
  Nightlife: <FireOutlined />,
};

const categoryColors: Record<string, string> = {
  Adventure: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  Food: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  Nature: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Sightseeing: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  Shopping: "text-pink-400 bg-pink-400/10 border-pink-400/30",
  Nightlife: "text-purple-400 bg-purple-400/10 border-purple-400/30",
};

interface StopCardProps {
  stop: ItineraryStop;
  index: number;
  onDelete: (id: string) => void;
  onAddActivity: (stopId: string) => void;
}

export default function StopCard({ stop, index, onDelete, onAddActivity }: StopCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex gap-6 ${isDragging ? "z-50 opacity-80" : "z-10"}`}
    >
      {/* Timeline Connector */}
      <div className="flex flex-col items-center flex-shrink-0 pt-2">
        <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.6)] z-10" />
        <div className="w-0.5 flex-1 bg-gradient-to-b from-cyan-500/40 to-transparent mt-1" />
      </div>

      {/* Card */}
      <div className={`flex-1 mb-8 bg-[#0a1628]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-lg group hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all duration-300 ${isDragging ? "ring-2 ring-cyan-400/50 shadow-[0_0_40px_rgba(34,211,238,0.3)]" : ""}`}>
        {/* Card Header */}
        <div className="flex items-center gap-4 p-5 border-b border-white/5">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-white/30 hover:text-cyan-400 transition-colors p-1"
          >
            <HolderOutlined className="text-lg" />
          </div>

          {/* Cover Thumbnail */}
          <div
            className="w-14 h-14 rounded-xl bg-cover bg-center border border-white/10 flex-shrink-0"
            style={{ backgroundImage: `url(${stop.coverUrl})` }}
          />

          {/* City Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white m-0 tracking-tight group-hover:text-cyan-300 transition-colors truncate">
              {stop.city}
            </h3>
            <div className="flex items-center text-white/50 text-sm">
              <EnvironmentOutlined className="mr-1 text-cyan-400" />
              {stop.country}
            </div>
          </div>

          {/* Day Badge */}
          <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-widest flex-shrink-0">
            DAY {index + 1}
          </div>

          {/* Delete */}
          <Tooltip title="Remove stop">
            <button
              onClick={() => onDelete(stop.id)}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 flex items-center justify-center text-white/40 hover:text-red-400 transition-all flex-shrink-0"
            >
              <DeleteOutlined />
            </button>
          </Tooltip>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Date & Budget Row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black/30 border border-white/5 rounded-xl p-3">
              <div className="text-[10px] text-white/40 tracking-widest mb-1 flex items-center">
                <CalendarOutlined className="mr-1" /> DATES
              </div>
              <div className="text-sm text-white/90 font-medium">
                {stop.startDate} → {stop.endDate}
              </div>
            </div>
            <div className="bg-black/30 border border-white/5 rounded-xl p-3">
              <div className="text-[10px] text-white/40 tracking-widest mb-1 flex items-center">
                <DollarOutlined className="mr-1" /> BUDGET
              </div>
              <div className="text-lg text-cyan-400 font-bold">{stop.budget}</div>
            </div>
          </div>

          {/* Notes */}
          {stop.notes && (
            <p className="text-white/50 text-sm mb-4 italic border-l-2 border-cyan-500/30 pl-3">
              {stop.notes}
            </p>
          )}

          {/* Activities */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-white/40 tracking-widest font-bold">ACTIVITIES</span>
              <button
                onClick={() => onAddActivity(stop.id)}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <PlusOutlined /> Add
              </button>
            </div>

            {stop.activities.length === 0 ? (
              <div className="text-center py-4 text-white/30 text-sm border border-dashed border-white/10 rounded-xl">
                No activities planned yet
              </div>
            ) : (
              <div className="space-y-2">
                {stop.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 bg-black/20 border border-white/5 rounded-xl p-3 hover:bg-white/5 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${categoryColors[activity.category]}`}>
                      {categoryIcons[activity.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white/90 font-medium truncate">{activity.name}</div>
                      <div className="text-xs text-white/40">{activity.timeSlot} · {activity.duration}</div>
                    </div>
                    <Tag className="bg-white/5 border-white/10 text-white/60 text-xs m-0 rounded-lg">
                      {activity.cost}
                    </Tag>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
