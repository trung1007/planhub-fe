"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

// Import icon từ react-icons/fa
import { FaHome, FaUser, FaCog, FaBars, FaArchive, FaRocket, FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";
import { usePathname } from "next/navigation";
import { FaBarsProgress } from "react-icons/fa6";
import { GoWorkflow } from "react-icons/go";

export interface MenuItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
}
export const menuItems = [
    // { label: "Issue", icon: <FaArchive size={20} />, href: "/" },
    { label: "Issue", icon: <FaArchive size={20} />, href: "/issue" },
    { label: "Scrum board", icon: <MdAnalytics size={20} />, href: "/scrum-board" },
    { label: "Workflow", icon: <GoWorkflow size={20} />, href: "/workflow" },
    { label: "Team", icon: <FaUser size={20} />, href: "/team" },
    { label: "Release", icon: <FaRocket size={20} />, href: "/release" },
    { label: "Sprint", icon: <FaBarsProgress size={20} />, href: "/sprint" },
    { label: "Settings", icon: <FaCog size={20} />, href: "/settings" },
];
export default function SideBar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    if (pathname === "/login" || pathname === '/forgot-password' || pathname === '/register') return null;
    return (
        <div
            className={clsx(
                "h-screen bg-third border-r shadow-sm transition-all duration-400  flex flex-col",
                collapsed ? "w-[70px]" : "w-[220px] min-w-[220px]"
            )}
            style={{ height: "100%" }}
        >
            {/* Header */}
            <div className="flex items-center justify-center p-4 border-b border-b-gray-700">
                {!collapsed && (<button onClick={() => setCollapsed(!collapsed)}>
                    <FaArrowCircleLeft color="white" size={16} />
                </button>)}
                {collapsed && (<button onClick={() => setCollapsed(!collapsed)}>
                    <FaArrowCircleRight color="white" size={16} />
                </button>)}
            </div>

            {/* Menu Items */}
            <nav className="flex-1" >
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={clsx(
                            "flex items-center gap-3 px-4 py-3 text-white hover:bg-primary transition-all duration-400",
                            collapsed && "justify-center",
                            (item.href === "/" && pathname.startsWith("/issue")) || pathname === item.href
                                ? "bg-primary font-semibold"
                                : ""
                        )}
                    >
                        {item.icon}
                        {!collapsed && <span className="text-[15px]">{item.label}</span>}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
