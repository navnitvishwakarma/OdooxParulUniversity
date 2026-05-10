"use client";

import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useRouter, usePathname } from "next/navigation";

const { Content } = Layout;

export default function MainLayout({ children }: any) {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/' && pathname !== '/') return false;
        return pathname.startsWith(path);
    };

    return (
        <Layout>
            <Sidebar />

            <Layout>
                <Navbar />

                <Content className="p-4 md:p-6 bg-surface min-h-screen pb-24 lg:pb-6 relative overflow-x-hidden">
                    {children}
                </Content>

                {/* Mobile Bottom Navigation */}
                <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-outline-variant px-md py-sm flex justify-around items-center z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                    <button 
                        onClick={() => router.push('/')}
                        className={`flex flex-col items-center gap-xs ${isActive('/') ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/') ? "'FILL' 1" : "'FILL' 0" }}>home</span>
                        <span className="text-[10px] font-bold">HOME</span>
                    </button>
                    
                    <button 
                        onClick={() => router.push('/trips')}
                        className={`flex flex-col items-center gap-xs ${isActive('/trips') && !pathname.includes('create') ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/trips') && !pathname.includes('create') ? "'FILL' 1" : "'FILL' 0" }}>flight_takeoff</span>
                        <span className="text-[10px] font-bold">TRIPS</span>
                    </button>
                    
                    <button 
                        onClick={() => router.push('/trips/create')}
                        className="bg-secondary text-white p-sm rounded-full -mt-lg shadow-xl border-4 border-white active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>
                    
                    <button 
                        onClick={() => router.push('/budget')}
                        className={`flex flex-col items-center gap-xs ${isActive('/budget') ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/budget') ? "'FILL' 1" : "'FILL' 0" }}>account_balance_wallet</span>
                        <span className="text-[10px] font-bold">BUDGET</span>
                    </button>
                    
                    <button 
                        onClick={() => router.push('/profile')}
                        className={`flex flex-col items-center gap-xs ${isActive('/profile') ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/profile') ? "'FILL' 1" : "'FILL' 0" }}>person</span>
                        <span className="text-[10px] font-bold">PROFILE</span>
                    </button>
                </nav>
            </Layout>
        </Layout>
    );
}