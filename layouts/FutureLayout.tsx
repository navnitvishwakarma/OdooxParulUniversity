"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { 
  HomeOutlined, 
  CompassOutlined, 
  PlusCircleOutlined,
  BuildOutlined,
  WalletOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  SearchOutlined
} from "@ant-design/icons";

export default function FutureLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      {/* Dynamic Background Gradient overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#050B14] to-[#050B14] z-0 pointer-events-none"></div>

      {/* Animated Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed left-0 top-0 h-full w-20 md:w-64 bg-[#050B14]/60 backdrop-blur-3xl border-r border-white/5 z-50 flex flex-col items-center md:items-start py-8 shadow-[4px_0_40px_rgba(0,0,0,0.8)] overflow-y-auto overflow-x-hidden"
      >
        <div className="md:px-8 mb-8 flex items-center justify-center w-full md:justify-start flex-shrink-0 cursor-pointer" onClick={() => router.push('/explore-3d')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)] flex-shrink-0">
            <span className="material-symbols-outlined text-white text-[20px]">public</span>
          </div>
          <span className="hidden md:block ml-3 font-bold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            TRAVELOOP
          </span>
        </div>

        <nav className="flex-1 w-full flex flex-col gap-2 px-4">
          <SidebarItem icon={<HomeOutlined />} label="Dashboard" onClick={() => router.push('/explore-3d')} active={pathname === '/explore-3d'} />
          <SidebarItem icon={<CompassOutlined />} label="My Trips" onClick={() => router.push('/trips')} active={pathname === '/trips'} />
          <SidebarItem icon={<PlusCircleOutlined />} label="Create Trip" onClick={() => router.push('/trips/create')} active={pathname === '/trips/create'} />
          <SidebarItem icon={<BuildOutlined />} label="Itinerary Builder" onClick={() => router.push('/itinerary')} active={pathname === '/itinerary'} />
          <SidebarItem icon={<WalletOutlined />} label="Budget" />
          <SidebarItem icon={<CheckSquareOutlined />} label="Packing Checklist" />
          <SidebarItem icon={<FileTextOutlined />} label="Notes" />
        </nav>

        <div className="w-full px-4 mt-8 flex flex-col gap-2 flex-shrink-0">
          <SidebarItem icon={<UserOutlined />} label="Profile" />
          <SidebarItem icon={<LogoutOutlined />} label="Logout" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/30 group-hover:text-red-300" />
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="relative z-10 ml-20 md:ml-64 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/5 bg-[#050B14]/80 backdrop-blur-md flex justify-between items-center px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-lg md:text-xl font-medium text-white/90 tracking-wide m-0 hidden md:block">Welcome back, Explorer</h1>
            
            {/* Search Bar */}
            <div className="relative group ml-0 md:ml-8">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-400 transition-colors">
                <SearchOutlined />
              </span>
              <input 
                type="text" 
                placeholder="Search destinations..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all w-48 md:w-64 placeholder:text-white/30"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <span className="material-symbols-outlined text-white/60 hover:text-cyan-400 transition-colors">notifications</span>
              <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            </div>
            
            {/* User Avatar */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white/90 m-0 group-hover:text-cyan-400 transition-colors">Alex Rivera</p>
                <p className="text-xs text-white/40 m-0">Pro Member</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-900 to-cyan-800 border border-cyan-500/30 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

function SidebarItem({ icon, label, active = false, className, onClick }: SidebarItemProps) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center w-full p-3 rounded-xl cursor-pointer transition-all duration-300 group ${active ? 'bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-l-cyan-400 border-y border-y-transparent border-r border-r-transparent rounded-l-none pl-4 shadow-[inset_20px_0_40px_-20px_rgba(34,211,238,0.3)]' : 'hover:bg-white/5 hover:pl-4 border border-transparent'} ${className || ''}`}
    >
      <div className={`text-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${active ? 'text-cyan-400 scale-110' : 'text-white/40 group-hover:text-cyan-300 group-hover:scale-110'} ${className || ''}`}>
        {icon}
      </div>
      <span className={`hidden md:block ml-4 font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${active ? 'text-cyan-100 font-bold' : 'text-white/50 group-hover:text-white/90'} ${className || ''}`}>
        {label}
      </span>
    </div>
  );
}
