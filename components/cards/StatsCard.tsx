"use client";

import { Card } from "antd";
import { ReactNode } from "react";

type Props = {
    title: string;
    value: string;
    icon?: ReactNode;
    trend?: string;
};

export default function StatsCard({ title, value, icon, trend }: Props) {
    return (
        <Card 
            className="rounded-2xl shadow-sm border-0 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow duration-300 overflow-hidden relative"
            styles={{ body: { padding: '24px' } }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                        {title}
                    </h2>
                    <p className="text-4xl font-extrabold text-gray-800 tracking-tight">
                        {value}
                    </p>
                    {trend && (
                        <p className="text-emerald-500 text-sm font-medium mt-2 flex items-center gap-1">
                            ↑ {trend}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl">
                        {icon}
                    </div>
                )}
            </div>
            {/* Decorative background shape */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 blur-2xl"></div>
        </Card>
    );
}