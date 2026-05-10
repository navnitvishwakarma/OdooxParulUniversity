"use client";

import MainLayout from "../../layouts/MainLayout";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
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

export default function BudgetAnalysis() {
    return (
        <MainLayout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-container-max mx-auto"
            >
                {/* Hero Header */}
                <motion.div variants={itemVariants} className="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-md">
                    <div>
                        <span className="bg-active-trip-pill text-white text-label-xs px-sm py-1 rounded-full uppercase mb-sm inline-block">Active Trip</span>
                        <h1 className="text-headline-lg font-headline-lg text-primary m-0">Swiss Alps Expedition 2024</h1>
                        <p className="text-body-md text-on-surface-variant mt-xs mb-0">June 12 - June 24 • 12 Days • Group of 4</p>
                    </div>
                    <div className="flex gap-sm">
                        <button className="flex items-center gap-xs border-2 border-primary text-primary px-md py-sm rounded-lg font-bold hover:bg-surface-container-low transition-all">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Export PDF
                        </button>
                        <button className="bg-primary text-white px-md py-sm rounded-lg font-bold shadow-md hover:scale-95 transition-all border-none">
                            Add Expense
                        </button>
                    </div>
                </motion.div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
                    {/* Overall Progress Card */}
                    <motion.div variants={itemVariants} className="md:col-span-4 bg-white p-md rounded-xl border border-outline-variant shadow-sm">
                        <div className="flex justify-between items-center mb-md">
                            <h3 className="text-headline-sm text-primary m-0">Total Budget</h3>
                            <span className="material-symbols-outlined text-primary">account_balance</span>
                        </div>
                        <div className="mb-base">
                            <span className="text-display-lg text-primary">$4,250.00</span>
                            <span className="text-body-sm text-on-surface-variant"> / $5,000.00</span>
                        </div>
                        <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden mb-sm">
                            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                        </div>
                        <div className="flex justify-between text-label-md">
                            <span className="text-on-surface-variant">85% Utilized</span>
                            <span className="text-secondary font-bold">$750.00 Remaining</span>
                        </div>
                    </motion.div>

                    {/* Spending Trends */}
                    <motion.div variants={itemVariants} className="md:col-span-8 bg-white p-md rounded-xl border border-outline-variant shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-md">
                            <h3 className="text-headline-sm text-primary m-0">Daily Spending Trend</h3>
                            <div className="flex gap-xs">
                                <button className="text-label-md bg-surface-container-low px-sm py-1 rounded-md border border-outline-variant">Daily</button>
                                <button className="text-label-md px-sm py-1 rounded-md hover:bg-surface-container-low border border-transparent">Cumulative</button>
                            </div>
                        </div>
                        {/* Mock Chart Visualization */}
                        <div className="flex-1 min-h-[150px] flex items-end justify-between gap-2 px-xs mt-4">
                            {[40, 65, 85, 100, 55, 70, 45, 90, 30, 50, 60, 20].map((height, i) => (
                                <div key={i} className={`w-full rounded-t-lg transition-all hover:bg-primary ${height === 100 ? 'bg-active-trip-pill' : 'bg-surface-container-high'}`} style={{ height: `${height}%` }}></div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-sm text-label-xs text-on-surface-variant opacity-60">
                            <span>DAY 1</span>
                            <span>DAY 6</span>
                            <span>DAY 12</span>
                        </div>
                    </motion.div>

                    {/* Category Breakdown (Donut Visualization) */}
                    <motion.div variants={itemVariants} className="md:col-span-5 bg-white p-md rounded-xl border border-outline-variant shadow-sm">
                        <h3 className="text-headline-sm text-primary mb-lg m-0">Category Breakdown</h3>
                        <div className="flex items-center gap-lg mt-6">
                            <div className="relative w-40 h-40 shrink-0">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#d6e4f9" strokeWidth="4"></circle>
                                    <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#00336c" strokeDasharray="40 60" strokeDashoffset="0" strokeWidth="4" className="transition-all duration-1000"></circle>
                                    <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#bb001e" strokeDasharray="25 75" strokeDashoffset="-40" strokeWidth="4" className="transition-all duration-1000"></circle>
                                    <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#434750" strokeDasharray="20 80" strokeDashoffset="-65" strokeWidth="4" className="transition-all duration-1000"></circle>
                                    <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#c3c6d2" strokeDasharray="15 85" strokeDashoffset="-85" strokeWidth="4" className="transition-all duration-1000"></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-headline-sm text-primary font-bold">$4.2k</span>
                                    <span className="text-label-xs opacity-60">TOTAL</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-base w-full">
                                {[
                                    { color: "bg-primary", label: "Transport", percent: "40%" },
                                    { color: "bg-secondary", label: "Accommodation", percent: "25%" },
                                    { color: "bg-[#434750]", label: "Food & Dining", percent: "20%" },
                                    { color: "bg-[#c3c6d2]", label: "Activities", percent: "15%" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-xs">
                                            <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                                            <span className="text-label-md">{item.label}</span>
                                        </div>
                                        <span className="text-label-md font-bold">{item.percent}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Itemized Expenses List */}
                    <motion.div variants={itemVariants} className="md:col-span-7 bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
                        <div className="p-md border-b border-outline-variant flex flex-col md:flex-row justify-between md:items-center gap-md bg-surface">
                            <h3 className="text-headline-sm text-primary m-0">Recent Expenses</h3>
                            <div className="flex gap-sm">
                                <select className="text-label-md border border-outline-variant rounded-lg bg-white px-sm py-1 focus:ring-primary outline-none">
                                    <option>All Categories</option>
                                    <option>Transport</option>
                                    <option>Food</option>
                                </select>
                                <select className="text-label-md border border-outline-variant rounded-lg bg-white px-sm py-1 focus:ring-primary outline-none">
                                    <option>Newest First</option>
                                    <option>Highest Price</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-[320px]">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-surface-container-low text-label-xs text-on-surface-variant sticky top-0 z-10">
                                    <tr>
                                        <th className="py-sm px-md uppercase font-bold">Date</th>
                                        <th className="py-sm px-md uppercase font-bold">Description</th>
                                        <th className="py-sm px-md uppercase font-bold">Category</th>
                                        <th className="py-sm px-md uppercase font-bold text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="text-body-sm">
                                    {[
                                        { date: "June 18", desc: "Zurich Lake Cruise", cat: "Activities", catClass: "bg-surface-container-high text-primary", amount: "$120.00" },
                                        { date: "June 18", desc: "Alpine Bistro Dinner", cat: "Food", catClass: "bg-status-included text-primary", amount: "$245.50" },
                                        { date: "June 17", desc: "Swiss Pass - 1st Class", cat: "Transport", catClass: "bg-surface-container text-primary", amount: "$680.00" },
                                        { date: "June 17", desc: "Mount Pilatus Cable Car", cat: "Activities", catClass: "bg-surface-container-high text-primary", amount: "$185.00" },
                                        { date: "June 16", desc: "Grand National Hotel", cat: "Lodging", catClass: "bg-status-included text-primary", amount: "$1,240.00" },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
                                            <td className="py-md px-md">{row.date}</td>
                                            <td className="py-md px-md font-bold text-primary">{row.desc}</td>
                                            <td className="py-md px-md">
                                                <span className={`${row.catClass} px-sm py-xs rounded-full text-label-xs font-bold`}>{row.cat}</span>
                                            </td>
                                            <td className="py-md px-md text-right font-bold">{row.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-sm bg-surface-container-low text-center mt-auto">
                            <button className="text-label-md text-primary font-bold hover:underline">View All 42 Transactions</button>
                        </div>
                    </motion.div>

                    {/* Savings Tip Card (Highlight) */}
                    <motion.div variants={itemVariants} className="md:col-span-12 lg:col-span-12 bg-primary rounded-xl p-md flex flex-col md:flex-row items-center gap-lg shadow-lg">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h4 className="text-headline-sm text-white m-0">Smart Saving Insight</h4>
                            <p className="text-body-md text-white/80 max-w-2xl mt-1 mb-0">By using your Swiss Travel Pass for the Lucerne lake ferries, you've saved an estimated <span className="font-bold text-white">$85.00</span> today. Your "Transport" budget is now performing 12% better than projected.</p>
                        </div>
                        <button className="md:ml-auto bg-white text-primary px-lg py-sm rounded-lg font-bold shadow-md hover:scale-95 transition-all mt-4 md:mt-0">
                            View Insights
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </MainLayout>
    );
}
