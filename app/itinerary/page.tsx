"use client";

import React, { useState, useCallback, useEffect } from "react";
import FutureLayout from "../../layouts/FutureLayout";
import StopCard, { ItineraryStop, Activity } from "../../components/future/StopCard";
import TripSummaryPanel from "../../components/future/TripSummaryPanel";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  PlusOutlined,
  CloseOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  CompassOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
  Button,
} from "antd";

const { TextArea } = Input;

// ── Mock Data ──────────────────────────────────────────────────
const INITIAL_STOPS: ItineraryStop[] = [
  {
    id: "stop-1",
    city: "Tokyo",
    country: "Japan",
    startDate: "2026-06-01",
    endDate: "2026-06-05",
    notes: "Explore Shibuya, Akihabara, and the ancient temples of Asakusa.",
    budget: "$3,200",
    coverUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop",
    activities: [
      { id: "a1", name: "Tsukiji Fish Market Tour", category: "Food", duration: "3h", cost: "$45", timeSlot: "7:00 AM" },
      { id: "a2", name: "Mount Fuji Day Trip", category: "Nature", duration: "10h", cost: "$120", timeSlot: "6:00 AM" },
      { id: "a3", name: "Akihabara Tech Walk", category: "Shopping", duration: "4h", cost: "$200", timeSlot: "2:00 PM" },
    ],
  },
  {
    id: "stop-2",
    city: "Singapore",
    country: "Singapore",
    startDate: "2026-06-06",
    endDate: "2026-06-08",
    notes: "Gardens by the Bay and Marina Bay Sands.",
    budget: "$1,800",
    coverUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop",
    activities: [
      { id: "a4", name: "Gardens by the Bay", category: "Sightseeing", duration: "3h", cost: "$30", timeSlot: "10:00 AM" },
      { id: "a5", name: "Hawker Center Food Tour", category: "Food", duration: "2h", cost: "$25", timeSlot: "6:00 PM" },
    ],
  },
  {
    id: "stop-3",
    city: "Bali",
    country: "Indonesia",
    startDate: "2026-06-09",
    endDate: "2026-06-14",
    notes: "Surfing, rice terraces, and cliff-top sunsets in Uluwatu.",
    budget: "$2,500",
    coverUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
    activities: [
      { id: "a6", name: "Tegallalang Rice Terraces", category: "Nature", duration: "4h", cost: "$15", timeSlot: "8:00 AM" },
      { id: "a7", name: "Uluwatu Sunset & Kecak Dance", category: "Sightseeing", duration: "3h", cost: "$20", timeSlot: "5:00 PM" },
      { id: "a8", name: "Seminyak Beach Club", category: "Nightlife", duration: "5h", cost: "$80", timeSlot: "8:00 PM" },
    ],
  },
];

const CITY_OPTIONS = [
  { value: "Tokyo", label: "Tokyo, Japan", country: "Japan", cover: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400" },
  { value: "Paris", label: "Paris, France", country: "France", cover: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400" },
  { value: "New York", label: "New York, USA", country: "USA", cover: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=400" },
  { value: "London", label: "London, UK", country: "UK", cover: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=400" },
  { value: "Dubai", label: "Dubai, UAE", country: "UAE", cover: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=400" },
  { value: "Singapore", label: "Singapore", country: "Singapore", cover: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=400" },
  { value: "Bali", label: "Bali, Indonesia", country: "Indonesia", cover: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400" },
  { value: "Sydney", label: "Sydney, Australia", country: "Australia", cover: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=400" },
  { value: "Cape Town", label: "Cape Town, South Africa", country: "South Africa", cover: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=400" },
  { value: "Rio de Janeiro", label: "Rio de Janeiro, Brazil", country: "Brazil", cover: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=400" },
];

const ACTIVITY_CATEGORIES = ["Adventure", "Food", "Nature", "Sightseeing", "Shopping", "Nightlife"] as const;

// ── Main Page ──────────────────────────────────────────────────
export default function ItineraryBuilder() {
  const [stops, setStops] = useState<ItineraryStop[]>(INITIAL_STOPS);
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "compact">("timeline");
  const [mounted, setMounted] = useState(false);
  const [addStopForm] = Form.useForm();
  const [addActivityForm] = Form.useForm();

  // Wait for client hydration before rendering DnD to avoid aria-describedby mismatch
  useEffect(() => { setMounted(true); }, []);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ── Handlers ────────────────────────────────────────────────
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setStops((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleDeleteStop = useCallback((id: string) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
    message.success({ content: "Stop removed from itinerary", style: { marginTop: "10vh" } });
  }, []);

  const handleAddStop = useCallback((values: any) => {
    const cityData = CITY_OPTIONS.find((c) => c.value === values.city);
    const newStop: ItineraryStop = {
      id: `stop-${Date.now()}`,
      city: values.city,
      country: cityData?.country || "",
      startDate: values.dates?.[0]?.format("YYYY-MM-DD") || "",
      endDate: values.dates?.[1]?.format("YYYY-MM-DD") || "",
      notes: values.notes || "",
      budget: `$${values.budget?.toLocaleString() || "0"}`,
      coverUrl: cityData?.cover || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400",
      activities: [],
    };
    setStops((prev) => [...prev, newStop]);
    setIsAddStopOpen(false);
    addStopForm.resetFields();
    message.success({ content: `${values.city} added to itinerary!`, style: { marginTop: "10vh" } });
  }, [addStopForm]);

  const handleAddActivity = useCallback((values: any) => {
    if (!activeStopId) return;
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      name: values.name,
      category: values.category,
      duration: values.duration || "2h",
      cost: `$${values.cost || 0}`,
      timeSlot: values.timeSlot || "10:00 AM",
    };
    setStops((prev) =>
      prev.map((s) =>
        s.id === activeStopId
          ? { ...s, activities: [...s.activities, newActivity] }
          : s
      )
    );
    setIsAddActivityOpen(false);
    setActiveStopId(null);
    addActivityForm.resetFields();
    message.success({ content: "Activity added!", style: { marginTop: "10vh" } });
  }, [activeStopId, addActivityForm]);

  const openAddActivity = useCallback((stopId: string) => {
    setActiveStopId(stopId);
    setIsAddActivityOpen(true);
  }, []);

  return (
    <FutureLayout>
      <div className="max-w-[1600px] mx-auto pb-16">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold tracking-[0.2em] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              ROUTE ARCHITECT
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight m-0">Itinerary Builder</h1>
            <p className="text-white/50 mt-2 text-lg">Drag, drop, and design your perfect journey.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-black/30 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === "timeline" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-white/50 border border-transparent hover:text-white"}`}
              >
                <UnorderedListOutlined className="mr-1" /> Timeline
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === "compact" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-white/50 border border-transparent hover:text-white"}`}
              >
                <AppstoreOutlined className="mr-1" /> Grid
              </button>
            </div>

            {/* Add Stop Button */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setIsAddStopOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-none text-white font-bold rounded-xl px-6 h-11 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              Add Stop
            </Button>
          </div>
        </motion.div>

        {/* ── Main Layout ── */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Itinerary Column */}
          <div className="flex-1 min-w-0">
            {/* Empty State */}
            {stops.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md"
              >
                <CompassOutlined className="text-7xl text-white/15 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">No stops planned</h2>
                <p className="text-white/40 mb-8 max-w-md text-center">
                  Start building your itinerary by adding your first destination.
                </p>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddStopOpen(true)}
                  className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 font-bold rounded-xl px-8"
                >
                  Add First Stop
                </Button>
              </motion.div>
            )}

            {/* Timeline View */}
            {stops.length > 0 && viewMode === "timeline" && mounted && (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={stops.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="pl-2">
                    <AnimatePresence>
                      {stops.map((stop, index) => (
                        <StopCard
                          key={stop.id}
                          stop={stop}
                          index={index}
                          onDelete={handleDeleteStop}
                          onAddActivity={openAddActivity}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Grid View */}
            {stops.length > 0 && viewMode === "compact" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stops.map((stop, index) => (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-[#0a1628]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl hover:border-cyan-500/30 transition-all group"
                  >
                    <div
                      className="h-32 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${stop.coverUrl})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                        <div>
                          <h3 className="text-xl font-bold text-white m-0">{stop.city}</h3>
                          <span className="text-white/60 text-sm">{stop.country}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold tracking-widest">
                          DAY {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between text-sm text-white/60 mb-2">
                        <span><CalendarOutlined className="mr-1" /> {stop.startDate}</span>
                        <span className="text-cyan-400 font-bold">{stop.budget}</span>
                      </div>
                      <div className="text-xs text-white/40">{stop.activities.length} activities</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Summary Panel */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <TripSummaryPanel stops={stops} />
          </div>
        </div>
      </div>

      {/* ── Add Stop Modal ── */}
      <Modal
        open={isAddStopOpen}
        onCancel={() => setIsAddStopOpen(false)}
        footer={null}
        closeIcon={<CloseOutlined className="text-white/60" />}
        className="custom-dark-modal"
        styles={{
          content: { backgroundColor: "#0c1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.5rem", padding: "2rem" },
          header: { backgroundColor: "transparent" },
        }}
        title={<span className="text-white text-xl font-bold">Add New Stop</span>}
      >
        <Form form={addStopForm} layout="vertical" onFinish={handleAddStop} requiredMark={false} className="mt-4">
          <Form.Item name="city" label={<span className="text-white/70">Destination</span>} rules={[{ required: true, message: "Select a city" }]}>
            <Select
              showSearch
              size="large"
              placeholder="Search city..."
              className="custom-dark-select"
              styles={{ popup: { root: { backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" } } }}
              options={CITY_OPTIONS}
            />
          </Form.Item>
          <Form.Item name="dates" label={<span className="text-white/70">Dates</span>} rules={[{ required: true, message: "Select dates" }]}>
            <DatePicker.RangePicker
              size="large"
              className="w-full bg-black/40 border-white/10 hover:border-cyan-500/50 rounded-xl"
              classNames={{ popup: { root: "custom-dark-datepicker" } }}
            />
          </Form.Item>
          <Form.Item name="budget" label={<span className="text-white/70">Budget (USD)</span>}>
            <InputNumber
              size="large"
              className="w-full bg-black/40 border-white/10 rounded-xl"
              prefix={<DollarOutlined className="text-cyan-400" />}
              placeholder="2000"
            />
          </Form.Item>
          <Form.Item name="notes" label={<span className="text-white/70">Notes</span>}>
            <TextArea rows={3} placeholder="Travel notes..." className="bg-black/40 border-white/10 text-white rounded-xl resize-none" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white font-bold rounded-xl h-12 shadow-[0_0_15px_rgba(34,211,238,0.3)] mt-2"
          >
            Add to Itinerary
          </Button>
        </Form>
      </Modal>

      {/* ── Add Activity Modal ── */}
      <Modal
        open={isAddActivityOpen}
        onCancel={() => { setIsAddActivityOpen(false); setActiveStopId(null); }}
        footer={null}
        closeIcon={<CloseOutlined className="text-white/60" />}
        className="custom-dark-modal"
        styles={{
          content: { backgroundColor: "#0c1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.5rem", padding: "2rem" },
          header: { backgroundColor: "transparent" },
        }}
        title={<span className="text-white text-xl font-bold">Add Activity</span>}
      >
        <Form form={addActivityForm} layout="vertical" onFinish={handleAddActivity} requiredMark={false} className="mt-4">
          <Form.Item name="name" label={<span className="text-white/70">Activity Name</span>} rules={[{ required: true }]}>
            <Input size="large" placeholder="e.g. Cooking Class" className="bg-black/40 border-white/10 text-white rounded-xl" />
          </Form.Item>
          <Form.Item name="category" label={<span className="text-white/70">Category</span>} rules={[{ required: true }]}>
            <Select
              size="large"
              placeholder="Select category"
              className="custom-dark-select"
              styles={{ popup: { root: { backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" } } }}
              options={ACTIVITY_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </Form.Item>
          <div className="grid grid-cols-3 gap-3">
            <Form.Item name="timeSlot" label={<span className="text-white/70">Time</span>}>
              <Input size="large" placeholder="10:00 AM" className="bg-black/40 border-white/10 text-white rounded-xl" />
            </Form.Item>
            <Form.Item name="duration" label={<span className="text-white/70">Duration</span>}>
              <Input size="large" placeholder="3h" className="bg-black/40 border-white/10 text-white rounded-xl" />
            </Form.Item>
            <Form.Item name="cost" label={<span className="text-white/70">Cost ($)</span>}>
              <InputNumber size="large" className="w-full bg-black/40 border-white/10 rounded-xl" placeholder="50" />
            </Form.Item>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white font-bold rounded-xl h-12 shadow-[0_0_15px_rgba(34,211,238,0.3)] mt-2"
          >
            Add Activity
          </Button>
        </Form>
      </Modal>

      {/* ── Dark Mode Style Overrides ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-dark-select .ant-select-selector {
          background-color: rgba(0, 0, 0, 0.4) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-radius: 0.75rem !important;
        }
        .custom-dark-select:hover .ant-select-selector {
          border-color: rgba(34, 211, 238, 0.5) !important;
        }
        .ant-select-dropdown { background-color: #0f172a !important; }
        .ant-select-item-option { color: rgba(255, 255, 255, 0.8) !important; }
        .ant-select-item-option-active { background-color: rgba(34, 211, 238, 0.1) !important; }
        .ant-select-item-option-selected { background-color: rgba(34, 211, 238, 0.2) !important; color: #22d3ee !important; }
        .ant-select-selection-placeholder { color: rgba(255,255,255,0.3) !important; }
        .ant-select-selection-item { color: white !important; }
        .ant-picker { background-color: rgba(0,0,0,0.4) !important; border-color: rgba(255,255,255,0.1) !important; }
        .ant-picker-input > input { color: white !important; }
        .ant-picker-input > input::placeholder { color: rgba(255,255,255,0.3) !important; }
        .ant-picker-separator { color: rgba(255,255,255,0.5) !important; }
        .ant-picker-suffix { color: #22d3ee !important; }
        .ant-input-number { background-color: transparent !important; color: white !important; }
        .ant-input-number-input { color: white !important; }
        .ant-modal-close { top: 1.5rem !important; right: 1.5rem !important; }
        .ant-tag { line-height: 1.5; }
      ` }} />
    </FutureLayout>
  );
}
