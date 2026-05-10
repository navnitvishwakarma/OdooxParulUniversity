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

export default function ProfileSettings() {
    return (
        <MainLayout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-container-max mx-auto"
            >
                {/* Page Header */}
                <motion.div variants={itemVariants} className="mb-xl">
                    <h1 className="text-display-lg font-display-lg text-primary mb-xs m-0">Profile & Settings</h1>
                    <p className="text-body-lg font-body-lg text-on-surface-variant m-0 mt-2">Manage your account details, preferences, and security.</p>
                </motion.div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-md items-start">
                    {/* Left Column: Personal Information & Preferences */}
                    <div className="md:col-span-8 flex flex-col gap-md">
                        {/* Section: Personal Info */}
                        <motion.section variants={itemVariants} className="bg-white rounded-xl border border-outline-variant p-md shadow-sm">
                            <div className="flex justify-between items-center mb-md">
                                <h2 className="text-headline-md font-headline-md text-primary m-0">Personal Information</h2>
                                <button className="text-secondary font-bold hover:underline text-body-sm">Edit All</button>
                            </div>
                            <div className="flex flex-col md:flex-row gap-lg items-center md:items-start mt-6">
                                <div className="relative group shrink-0">
                                    <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            alt="Profile photo" 
                                            className="w-full h-full object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuZH_FsMmzPaxuzi8Hf45IyTYTPcOy6NMnnFi92go_OanbmakOkOwKtg8R-GPO015LH3q5-RuuDIcgizWFyiTIeLj3tbDqNpsrq1Qx83op3Kl533zxIbVtkD0aOrXnK8x-uNGcHhf4si68am5PsAylaJ-V2khPflE5cFO61HxsqKhB3CYyUVh-yDWbedD1r0PoP39ZK-tnAzDSV6FGlDnrxWsOlHQa7GlELElVyXKz7RbG9x2XnnunIIsonm70i7i7TaugzQSc9A4"
                                        />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 bg-secondary text-white p-xs rounded-lg shadow-md hover:scale-105 transition-transform border-none">
                                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                                    </button>
                                </div>
                                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-md w-full">
                                    <div className="space-y-xs flex flex-col">
                                        <label className="text-label-md font-label-md text-on-surface-variant uppercase mb-1">Full Name</label>
                                        <input className="w-full bg-surface-container-low border-none rounded-lg p-sm focus:ring-2 focus:ring-primary text-body-md outline-none" type="text" defaultValue="Alexander Thompson"/>
                                    </div>
                                    <div className="space-y-xs flex flex-col">
                                        <label className="text-label-md font-label-md text-on-surface-variant uppercase mb-1">Email Address</label>
                                        <input className="w-full bg-surface-container-low border-none rounded-lg p-sm focus:ring-2 focus:ring-primary text-body-md outline-none" type="email" defaultValue="alex.thompson@traveloop.com"/>
                                    </div>
                                    <div className="space-y-xs flex flex-col">
                                        <label className="text-label-md font-label-md text-on-surface-variant uppercase mb-1">Phone Number</label>
                                        <input className="w-full bg-surface-container-low border-none rounded-lg p-sm focus:ring-2 focus:ring-primary text-body-md outline-none" type="tel" defaultValue="+1 (555) 012-3456"/>
                                    </div>
                                    <div className="space-y-xs flex flex-col">
                                        <label className="text-label-md font-label-md text-on-surface-variant uppercase mb-1">Location</label>
                                        <input className="w-full bg-surface-container-low border-none rounded-lg p-sm focus:ring-2 focus:ring-primary text-body-md outline-none" type="text" defaultValue="London, United Kingdom"/>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section: Preferences */}
                        <motion.section variants={itemVariants} className="bg-white rounded-xl border border-outline-variant p-md shadow-sm">
                            <h2 className="text-headline-md font-headline-md text-primary mb-md m-0">Travel Preferences</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-md mt-6">
                                <div className="space-y-xs flex flex-col">
                                    <label className="text-label-md font-label-md text-on-surface-variant uppercase mb-1">Language</label>
                                    <select className="w-full bg-surface-container-low border-none rounded-lg p-sm focus:ring-2 focus:ring-primary text-body-md outline-none">
                                        <option>English (UK)</option>
                                        <option>English (US)</option>
                                        <option>Français</option>
                                        <option>Español</option>
                                    </select>
                                </div>
                                <div className="space-y-xs flex flex-col">
                                    <label className="text-label-md font-label-md text-on-surface-variant uppercase mb-1">Currency</label>
                                    <select className="w-full bg-surface-container-low border-none rounded-lg p-sm focus:ring-2 focus:ring-primary text-body-md outline-none">
                                        <option>GBP (£)</option>
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                    </select>
                                </div>
                                <div className="space-y-xs flex flex-col">
                                    <label className="text-label-md font-label-md text-on-surface-variant uppercase mb-1">Timezone</label>
                                    <select className="w-full bg-surface-container-low border-none rounded-lg p-sm focus:ring-2 focus:ring-primary text-body-md outline-none">
                                        <option>GMT (UTC+0)</option>
                                        <option>EST (UTC-5)</option>
                                        <option>CET (UTC+1)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-lg border-t border-outline-variant pt-lg">
                                <h3 className="text-headline-sm font-headline-sm text-primary mb-sm m-0">Notifications</h3>
                                <div className="space-y-md mt-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-primary m-0">Trip Updates</p>
                                            <p className="text-body-sm text-on-surface-variant m-0 mt-1">Real-time alerts about flight changes and itinerary updates.</p>
                                        </div>
                                        <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-primary m-0">Newsletter & Promotions</p>
                                            <p className="text-body-sm text-on-surface-variant m-0 mt-1">Weekly inspiration and exclusive Traveloop deals.</p>
                                        </div>
                                        <div className="w-12 h-6 bg-surface-container-highest rounded-full relative cursor-pointer shadow-inner">
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Section: Saved Destinations */}
                        <motion.section variants={itemVariants} className="bg-white rounded-xl border border-outline-variant p-md shadow-sm">
                            <div className="flex justify-between items-center mb-md">
                                <h2 className="text-headline-md font-headline-md text-primary m-0">Saved Destinations</h2>
                                <button className="text-secondary font-bold hover:underline text-body-sm">View All (12)</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sm mt-4">
                                {/* Destination Card 1 */}
                                <div className="group relative rounded-lg overflow-hidden h-40 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        alt="Positano" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDIK6RvbcyHuG_fk0Te2uE6wJZzTrFLhtsZnMCPejJg0cWmyb2KgdJ-C-Wrcn36ZtcJR_OA2TFnUDl-ycFidLcWZ4hZYFZrIHxlnU9VuaZBzbdFwMwvEoFY4T57i8-ZVTUHsQQQNGv3YDHr2m2tg-iQsTH3kwJCPdhrq_qMtCXBdUcw_QG8ViiyVVA_0RXMuvP39c9wVAr0i2KEYz7fM8F9NMDMLmLdIVImHHRmefG8s8yNyR6TryIORiCnGpj6ILDW-rsuURFM4I"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                                    <div className="absolute bottom-2 left-2 text-white">
                                        <p className="font-bold m-0">Positano, Italy</p>
                                        <p className="text-label-md opacity-80 m-0">Saved 2 days ago</p>
                                    </div>
                                    <button className="absolute top-2 right-2 bg-white/20 backdrop-blur-md p-xs rounded-full text-white hover:bg-white/40 transition-colors border-none">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                    </button>
                                </div>
                                {/* Destination Card 2 */}
                                <div className="group relative rounded-lg overflow-hidden h-40 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        alt="Tokyo" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2_5fFfn51vAMiWKK-bSJkuOLpD-qsV5F9j6O1No6zFaM2P-LEvUzkWPswuqjp5qFe4QdKB2gQGcN5mMdnGzSE0WJHNkgZVEX7iEl4rK_IZTKxsIcBqAVOMkdPsCzhY7HHnS4xmkQh9w77ywLyJIbkLvx7VtTnJyKRa_4qPJwbLv8vnFXjBQ5sCHvtGZfKh7CpW-PeM7msjBqnT9LxygSEqLom4FdHVbbapk3jyzR_ucOMMh_srLdJ7FTGz3-MnPJG6KbEAsFyOHQ"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                                    <div className="absolute bottom-2 left-2 text-white">
                                        <p className="font-bold m-0">Tokyo, Japan</p>
                                        <p className="text-label-md opacity-80 m-0">Saved 1 week ago</p>
                                    </div>
                                    <button className="absolute top-2 right-2 bg-white/20 backdrop-blur-md p-xs rounded-full text-white hover:bg-white/40 transition-colors border-none">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                    </button>
                                </div>
                                {/* Destination Card 3 */}
                                <div className="group relative rounded-lg overflow-hidden h-40 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        alt="Zermatt" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHSN46FYD33cR8fkwKBnobSLw1hdADDyaLNAr7op4Dzf0PQ55Mobw12R-EjF8IfGKS38ARSrIXgebz_KYkYUJW8TvWLptYfswgegiBq5q-NX7h1fg1L7_-zpMzzlS9IBS1mr4zJ5Jko4En7EotQDzKhvpldDLI-fm63xhtsJOVwOJFYI0JjyQ6x2eDK6nVkTiVY0pc4s20tIeEORC5dk1CO8RYOfjzhVcjQuaxg5HuEdFhXPiOS0AcuURgzXOr1OxIEq_nEMlHquQ"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                                    <div className="absolute bottom-2 left-2 text-white">
                                        <p className="font-bold m-0">Zermatt, Switzerland</p>
                                        <p className="text-label-md opacity-80 m-0">Saved 3 weeks ago</p>
                                    </div>
                                    <button className="absolute top-2 right-2 bg-white/20 backdrop-blur-md p-xs rounded-full text-white hover:bg-white/40 transition-colors border-none">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                    </button>
                                </div>
                            </div>
                        </motion.section>
                    </div>

                    {/* Right Column: Account Security & Status */}
                    <div className="md:col-span-4 flex flex-col gap-md">
                        {/* Section: Security */}
                        <motion.section variants={itemVariants} className="bg-white rounded-xl border border-outline-variant p-md shadow-sm">
                            <h2 className="text-headline-md font-headline-md text-primary mb-md m-0">Account Security</h2>
                            <div className="space-y-md mt-6">
                                <div className="flex items-center gap-md">
                                    <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center text-primary shrink-0">
                                        <span className="material-symbols-outlined">lock</span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-primary m-0">Password</p>
                                        <p className="text-body-sm text-on-surface-variant m-0">Last changed 4 months ago</p>
                                    </div>
                                    <button className="text-secondary font-bold text-label-md uppercase hover:underline">Change</button>
                                </div>
                                <div className="flex items-center gap-md">
                                    <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center text-primary shrink-0">
                                        <span className="material-symbols-outlined">security</span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-primary m-0">Two-Factor Auth</p>
                                        <p className="text-body-sm text-on-surface-variant m-0">Active on +1 ••• ••• 56</p>
                                    </div>
                                    <span className="bg-status-included text-primary text-[10px] px-sm py-xs rounded-full font-bold">ACTIVE</span>
                                </div>
                                <div className="flex items-center gap-md">
                                    <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center text-primary shrink-0">
                                        <span className="material-symbols-outlined">devices</span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-primary m-0">Connected Devices</p>
                                        <p className="text-body-sm text-on-surface-variant m-0">3 devices currently active</p>
                                    </div>
                                    <button className="text-secondary font-bold text-label-md uppercase hover:underline">Review</button>
                                </div>
                            </div>
                            <button className="w-full mt-lg border-2 border-primary text-primary font-bold py-sm rounded-lg hover:bg-surface-container-low transition-colors bg-transparent">
                                Download Personal Data
                            </button>
                        </motion.section>

                        {/* Section: Membership Tier */}
                        <motion.section variants={itemVariants} className="bg-primary text-white rounded-xl p-md shadow-md overflow-hidden relative">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-lg">
                                    <span className="bg-secondary px-sm py-xs rounded-lg text-label-md font-bold shadow-sm">PRO MEMBER</span>
                                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                                </div>
                                <h3 className="text-headline-sm font-headline-sm mb-xs m-0 text-white">Elite Explorer Status</h3>
                                <p className="text-body-sm opacity-80 mb-md mt-1">You've unlocked priority concierge support and early access to group trips.</p>
                                <div className="w-full bg-white/20 h-2 rounded-full mb-xs">
                                    <div className="bg-secondary w-3/4 h-full rounded-full"></div>
                                </div>
                                <p className="text-label-md m-0">Next Reward: 2,500 miles</p>
                            </div>
                            {/* Abstract Background Decoration */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                        </motion.section>

                        {/* Danger Zone */}
                        <motion.section variants={itemVariants} className="bg-white rounded-xl border border-outline-variant p-md shadow-sm">
                            <h2 className="text-label-md font-label-md text-secondary uppercase mb-sm m-0">Danger Zone</h2>
                            <p className="text-body-sm text-on-surface-variant mb-md mt-2">Permanently delete your Traveloop account and all trip history.</p>
                            <button className="w-full py-sm text-secondary font-bold border-2 border-secondary/20 rounded-lg hover:bg-secondary/5 transition-colors bg-transparent">
                                Delete Account
                            </button>
                        </motion.section>
                    </div>
                </div>
            </motion.div>
        </MainLayout>
    );
}
