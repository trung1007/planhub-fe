"use client";

import { useState } from "react";
import { Tabs } from "antd";
import { FaClipboardList, FaUsers, FaUserShield } from "react-icons/fa";
import UserTabContent from "@/components/UserTabContent";
import RoleTabContent from "@/components/RoleTabContent";

const settingItems = [
    { key: "project", label: "Project", icon: <FaClipboardList /> },
    { key: "role", label: "Role & Permission", icon: <FaUserShield /> },
    { key: "user", label: "User", icon: <FaUsers /> },
];

const tabItems = [
    {
        key: "project",
        label: null,
        children: (
            <>
                <h3 className="text-xl font-semibold mb-4 border-b p-3">Project Settings</h3>
                <p>Nội dung tab Project…</p>
            </>
        ),
    },
    {
        key: "role",
        label: null,
        children: <div className="w-full"><RoleTabContent /></div>,
    },
    {
        key: "user",
        label: null,
        children: <div className="w-full"><UserTabContent /></div>,
    },
];

const SettingsPage = () => {
    const [activeKey, setActiveKey] = useState("project");

    return (
        <div className="flex gap-6 h-full w-full">

            {/* SIDEBAR 30% */}
            <div className="w-[20%] bg-white">
                <h2 className="text-xl font-semibold mb-4 border-b p-3">Settings</h2>

                <div className="flex flex-col p-3 gap-2">
                    {settingItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveKey(item.key)}
                            className={`
                flex items-center gap-3 px-3 py-3 text-sm text-left
                hover:bg-background transition
                ${activeKey === item.key ? "bg-background font-medium" : ""}
              `}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT 70% */}
            <div className="w-[80%] bg-white">
                <Tabs
                    activeKey={activeKey}
                    onChange={setActiveKey}
                    items={tabItems}
                    className="w-full"
                    rootClassName="w-full tabs-full"
                    tabBarStyle={{ display: "none" }}
                />
            </div>
        </div>
    );
};

export default SettingsPage;
