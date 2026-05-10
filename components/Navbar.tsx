"use client";

import { usePathname } from "next/navigation";
import { Avatar, Badge, Button } from "antd";
import { BellOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";

export default function Navbar() {
    const pathname = usePathname();

    const getTitle = () => {
        if (pathname === "/") return "Dashboard";
        if (pathname.startsWith("/trips/create")) return "Create Trip";
        if (pathname.startsWith("/trips")) return "My Trips";
        if (pathname.startsWith("/budget")) return "Budget Planner";
        if (pathname.startsWith("/packing")) return "Packing Checklist";
        if (pathname.startsWith("/community")) return "Community";
        if (pathname.startsWith("/profile")) return "Profile";
        if (pathname.startsWith("/settings")) return "Settings";
        return "Dashboard";
    };

    return (
        <div className="bg-white px-4 md:px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10 border-b border-gray-100">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight m-0 ml-10 lg:ml-0">
                {getTitle()}
            </h1>

            <div className="flex items-center gap-3 md:gap-6">
                <Button type="text" icon={<SearchOutlined className="text-lg text-gray-500" />} />
                
                <Badge count={3} size="small">
                    <Button type="text" icon={<BellOutlined className="text-lg text-gray-500" />} />
                </Badge>
                
                <div className="flex items-center gap-3 cursor-pointer pl-2 border-l border-gray-200">
                    <Avatar size="large" icon={<UserOutlined />} className="bg-blue-500" />
                    <div className="hidden md:block text-sm">
                        <p className="font-semibold text-gray-700 m-0 leading-tight">Alex Traveler</p>
                        <p className="text-gray-400 text-xs m-0">Pro Member</p>
                    </div>
                </div>
            </div>
        </div>
    );
}