"use client";

import MainLayout from "../../layouts/MainLayout";
import { motion } from "framer-motion";
import { Checkbox } from "antd";

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

export default function PackingChecklist() {
    return (
        <MainLayout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-container-max mx-auto"
            >
                {/* Hero Header Section */}
                <motion.section variants={itemVariants} className="mb-lg">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-md">
                        <div>
                            <nav className="flex items-center gap-xs text-label-md mb-xs text-primary font-bold">
                                <span>MY TRIPS</span>
                                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                <span className="text-on-surface-variant opacity-60">ITALY SUMMER 2024</span>
                            </nav>
                            <h1 className="text-headline-lg font-headline-lg text-primary m-0">Packing Checklist</h1>
                            <p className="text-body-md text-on-surface-variant mt-xs mb-0">10 days in Amalfi Coast & Rome • Departing July 12th</p>
                        </div>
                        <div className="flex gap-sm">
                            <button className="flex items-center gap-xs border-2 border-primary text-primary px-md py-sm rounded-lg font-bold hover:bg-surface-container-low transition-colors">
                                <span className="material-symbols-outlined">refresh</span>
                                Reset List
                            </button>
                            <button className="bg-secondary text-white px-md py-sm rounded-lg font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-xs">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
                                Add Item
                            </button>
                        </div>
                    </div>

                    {/* Progress Tracker */}
                    <div className="bg-white rounded-xl p-md shadow-sm border border-outline-variant">
                        <div className="flex justify-between items-center mb-sm">
                            <div className="flex items-center gap-sm">
                                <span className="font-headline-sm text-headline-sm text-primary">12/20</span>
                                <span className="text-body-md text-on-surface-variant">Items Packed</span>
                            </div>
                            <span className="bg-status-included text-primary font-bold px-sm py-xs rounded-full text-label-md">60% COMPLETE</span>
                        </div>
                        <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                            <div className="bg-secondary h-full transition-all duration-500" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                </motion.section>

                {/* Packing Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
                    {/* Left Column: Checklists */}
                    <div className="lg:col-span-8 flex flex-col gap-lg">
                        {/* Essentials Category */}
                        <motion.div variants={itemVariants} className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                            <div className="bg-surface-container px-md py-sm border-b border-outline-variant flex justify-between items-center">
                                <div className="flex items-center gap-sm">
                                    <span className="material-symbols-outlined text-primary">assignment_turned_in</span>
                                    <h3 className="font-headline-sm text-headline-sm text-primary m-0">Essentials</h3>
                                </div>
                                <span className="text-label-md text-on-surface-variant font-bold">4/4 ITEMS</span>
                            </div>
                            <div className="p-md space-y-md">
                                {[
                                    "Passport & Visas",
                                    "Travel Insurance Docs",
                                    "Flight Tickets (Digital/Print)",
                                    "Wallet & Currency"
                                ].map((item, idx) => (
                                    <label key={idx} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-md">
                                            <Checkbox defaultChecked className="scale-125" />
                                            <span className="text-body-md line-through text-on-surface-variant opacity-60 ml-2">{item}</span>
                                        </div>
                                        <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 text-on-surface-variant transition-opacity">more_vert</span>
                                    </label>
                                ))}
                            </div>
                        </motion.div>

                        {/* Clothing Category */}
                        <motion.div variants={itemVariants} className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                            <div className="bg-surface-container px-md py-sm border-b border-outline-variant flex justify-between items-center">
                                <div className="flex items-center gap-sm">
                                    <span className="material-symbols-outlined text-primary">checkroom</span>
                                    <h3 className="font-headline-sm text-headline-sm text-primary m-0">Clothing</h3>
                                </div>
                                <span className="text-label-md text-on-surface-variant font-bold">5/10 ITEMS</span>
                            </div>
                            <div className="p-md space-y-md">
                                {[
                                    { name: "Linen Shirts (x4)", checked: true },
                                    { name: "Swimwear (x2)", checked: false },
                                    { name: "Comfortable Walking Shoes", checked: true },
                                    { name: "Evening Dinner Outfit", checked: false },
                                ].map((item, idx) => (
                                    <label key={idx} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-md">
                                            <Checkbox defaultChecked={item.checked} className="scale-125" />
                                            <span className={`text-body-md ml-2 ${item.checked ? 'text-on-surface-variant' : ''}`}>{item.name}</span>
                                        </div>
                                        <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 text-on-surface-variant transition-opacity">more_vert</span>
                                    </label>
                                ))}
                            </div>
                            <div className="px-md pb-md mt-2">
                                <button className="text-primary font-bold text-label-md flex items-center gap-xs hover:opacity-80 transition-all">
                                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                    ADD CLOTHING ITEM
                                </button>
                            </div>
                        </motion.div>

                        {/* Electronics & Toiletries Row */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                            <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                                <div className="bg-surface-container px-md py-sm border-b border-outline-variant flex justify-between items-center">
                                    <div className="flex items-center gap-sm">
                                        <span className="material-symbols-outlined text-primary">devices</span>
                                        <h3 className="font-headline-sm text-headline-sm text-primary m-0">Electronics</h3>
                                    </div>
                                </div>
                                <div className="p-md space-y-sm">
                                    {[
                                        { name: "Universal Adapter", checked: true },
                                        { name: "Power Bank", checked: false },
                                        { name: "Camera & Spare Battery", checked: true },
                                    ].map((item, idx) => (
                                        <label key={idx} className="flex items-center gap-md cursor-pointer py-1">
                                            <Checkbox defaultChecked={item.checked} className="scale-125" />
                                            <span className="text-body-md ml-2">{item.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                                <div className="bg-surface-container px-md py-sm border-b border-outline-variant flex justify-between items-center">
                                    <div className="flex items-center gap-sm">
                                        <span className="material-symbols-outlined text-primary">sanitizer</span>
                                        <h3 className="font-headline-sm text-headline-sm text-primary m-0">Toiletries</h3>
                                    </div>
                                </div>
                                <div className="p-md space-y-sm">
                                    {[
                                        { name: "Sunscreen (SPF 50+)", checked: true },
                                        { name: "Travel Toiletry Kit", checked: false },
                                        { name: "First Aid Basics", checked: false },
                                    ].map((item, idx) => (
                                        <label key={idx} className="flex items-center gap-md cursor-pointer py-1">
                                            <Checkbox defaultChecked={item.checked} className="scale-125" />
                                            <span className="text-body-md ml-2">{item.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Notes & Reminders */}
                    <div className="lg:col-span-4 flex flex-col gap-lg">
                        {/* Trip Notes */}
                        <motion.div variants={itemVariants} className="bg-white rounded-xl border border-outline-variant shadow-sm p-md">
                            <div className="flex items-center gap-sm mb-md">
                                <span className="material-symbols-outlined text-secondary">event_note</span>
                                <h3 className="font-headline-sm text-headline-sm text-primary m-0">Trip Notes</h3>
                            </div>
                            <div className="space-y-md">
                                <div className="bg-surface-container-low p-sm rounded-lg border-l-4 border-secondary">
                                    <p className="text-body-sm text-on-surface-variant italic m-0">"Don't forget to pack the printed reservation for the Vatican tour on Day 4. The digital QR code can be finicky at the entrance."</p>
                                </div>
                                <div className="bg-surface-container-low p-sm rounded-lg border-l-4 border-primary">
                                    <p className="text-body-sm text-on-surface-variant font-semibold mb-xs">Local Weather Tip:</p>
                                    <p className="text-body-sm text-on-surface-variant m-0">Hot and humid (32°C). Pack extra linen and stay hydrated.</p>
                                </div>
                                <textarea className="w-full h-32 rounded-lg border border-outline-variant bg-surface text-body-sm focus:ring-2 focus:ring-primary focus:border-primary p-md outline-none transition-all" placeholder="Add a new note..."></textarea>
                                <button className="w-full bg-primary text-white py-sm rounded-lg font-bold text-label-md hover:bg-primary/90 transition-all active:scale-95 shadow-md">Save Note</button>
                            </div>
                        </motion.div>

                        {/* Quick Reminders Chip List */}
                        <motion.div variants={itemVariants} className="bg-surface-container-high rounded-xl p-md">
                            <h4 className="text-label-md font-bold text-primary mb-sm uppercase tracking-wider m-0">Quick Reminders</h4>
                            <div className="flex flex-wrap gap-xs mt-3">
                                {[
                                    "Check Passport Expiry",
                                    "Notify Bank of Travel",
                                    "Download Offline Maps"
                                ].map((reminder, idx) => (
                                    <span key={idx} className="bg-white px-sm py-xs rounded-full border border-outline-variant text-label-md flex items-center gap-xs shadow-sm">
                                        <span className="material-symbols-outlined text-[16px] text-secondary">notifications_active</span>
                                        {reminder}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Promotion/Upsell Card */}
                        <motion.div variants={itemVariants} className="relative rounded-xl overflow-hidden shadow-sm h-48 group cursor-pointer border border-outline-variant">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                alt="Amalfi Coast" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8ve-D5W6yd87xJ7FfjX9YPAdHSoiFYm1oZLbY6zNOkitQFE8K4BA-mlmT-pBKuYVT01HUfwZMD6LEGc1ZSHG6Rl97KwU2J2kECeYlXsURCzgRTt-8mpnfHriwJ18saS55zVDjHRSbb_6e87S_LMOqSbgPPTodwWbUd50Of_x1PWjmljNTLawqoL--AL1SAKBjI6te4NdfUwNymCl7j4iWf51MrOochY6Z79Q1Yd1dz1hw1HX_y-kpKQZCWekhORPLrOVZaA4nzW4"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-80"></div>
                            <div className="absolute bottom-md left-md right-md">
                                <p className="text-white text-label-md font-bold mb-xs uppercase m-0">Missing something?</p>
                                <p className="text-white text-headline-sm font-headline-sm mb-sm leading-tight m-0">Explore curated gear for Italy.</p>
                                <a className="text-secondary font-bold text-label-md flex items-center gap-xs hover:text-white transition-colors" href="#">
                                    SHOP TRAVEL STORE
                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </MainLayout>
    );
}
