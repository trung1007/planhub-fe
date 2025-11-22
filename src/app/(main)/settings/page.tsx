"use client";

import { useState } from "react";
import { Tabs } from "antd";
import { FaClipboardList, FaUsers, FaUserShield } from "react-icons/fa";
import UserTabContent from "@/components/UserTabContent";
import RoleTabContent from "@/components/RoleTabContent";
import ProjectTabContent from "@/components/ProjectTabContent";

const settingItems = [
    { key: "project", label: "Project", icon: <FaClipboardList /> },
    { key: "role", label: "Role & Permission", icon: <FaUserShield /> },
    { key: "user", label: "User", icon: <FaUsers /> },
];


const SettingsPage = () => {
    const [activeKey, setActiveKey] = useState("project");
    const [roleScreen, setRoleScreen] = useState<"list" | "permission">("list");
    const tabItems = [
        {
            key: "project",
            label: null,
            children: <div className="w-full"><ProjectTabContent /></div>,
        },
        {
            key: "role",
            label: null,
            children: <div className="w-full"> <RoleTabContent
                roleScreen={roleScreen}
                setRoleScreen={setRoleScreen}
            /></div>,
        },
        {
            key: "user",
            label: null,
            children: <div className="w-full"><UserTabContent /></div>,
        },
    ];

    return (
        <div className="flex gap-6 h-full w-full min-h-fit ">

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

            <div className="min-w-[80%] w-[80%] h-full flex flex-col bg-white">
                <Tabs
                    activeKey={activeKey}
                    onChange={setActiveKey}
                    items={tabItems}
                    className="flex-1"
                    rootClassName="h-full"
                    tabBarStyle={{ display: "none" }}
                />
            </div>
        </div>
    );
};

export default SettingsPage;
