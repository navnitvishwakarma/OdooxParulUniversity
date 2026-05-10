"use client";

import { Layout, Menu } from "antd";
import {
    HomeOutlined,
    CalendarOutlined,
    PlusCircleOutlined,
    DollarOutlined,
    UserOutlined,
    CheckSquareOutlined,
    GlobalOutlined,
    SettingOutlined
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { COLORS } from "../constants/theme";

const { Sider } = Layout;

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { key: "/", icon: <HomeOutlined />, label: "Dashboard" },
        { key: "/trips", icon: <CalendarOutlined />, label: "My Trips" },
        { key: "/trips/create", icon: <PlusCircleOutlined />, label: "Create Trip" },
        { key: "/budget", icon: <DollarOutlined />, label: "Budget" },
        { key: "/packing", icon: <CheckSquareOutlined />, label: "Packing Checklist" },
        { key: "/community", icon: <GlobalOutlined />, label: "Community" },
        { key: "/profile", icon: <UserOutlined />, label: "Profile" },
        { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
    ];

    // Determine the active key based on current path
    const activeKey = menuItems.find(item => pathname === item.key || (item.key !== "/" && pathname.startsWith(item.key)))?.key || "/";

    return (
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            width={260}
            className="min-h-screen border-r border-gray-200 z-50 absolute lg:relative"
            style={{
                background: COLORS.white,
                boxShadow: "2px 0 8px rgba(0,0,0,0.05)"
            }}
        >
            {/* Logo */}
            <div
                className="text-3xl font-extrabold p-8 cursor-pointer tracking-tight"
                style={{ color: COLORS.primary }}
                onClick={() => router.push("/")}
            >
                Traveloop
            </div>

            {/* Menu */}
            <Menu
                mode="inline"
                selectedKeys={[activeKey]}
                onClick={(e) => router.push(e.key)}
                style={{
                    borderRight: "none",
                    padding: "0 16px"
                }}
                items={menuItems.map(item => ({
                    ...item,
                    className: "rounded-lg mb-2 font-medium hover:text-blue-600 transition-colors duration-200",
                }))}
            />
        </Sider>
    );
}