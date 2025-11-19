"use client";

import { useState } from "react";
import { Tabs } from "antd";
import { FaClipboardList, FaUsers, FaUserShield } from "react-icons/fa";
import UserTabContent from "@/components/UserTabContent";

const settingItems = [
    { key: "project", label: "Project", icon: <FaClipboardList /> },
    { key: "role", label: "Role & Permission", icon: <FaUserShield /> },
    { key: "user", label: "User", icon: <FaUsers /> },
];

const SettingsPage = () => {
    const [activeKey, setActiveKey] = useState("project");

    return (
        <div className="flex gap-6 h-full w-full">

            {/* SIDEBAR 30% */}
            <div className="w-[30%] bg-white">
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
            <div className="w-[70%] bg-white">
                <Tabs activeKey={activeKey} onChange={setActiveKey} tabBarStyle={{ display: "none" }}>
                    <Tabs.TabPane key="project">
                        <h3 className="text-xl font-semibold mb-4 border-b p-3">Project Settings</h3>
                        <p>Nội dung tab Project…</p>
                    </Tabs.TabPane>

                    <Tabs.TabPane key="role">
                        <h3 className="text-xl font-semibold mb-4 border-b p-3">Role & Permission</h3>
                        <p>Nội dung tab Role…</p>
                    </Tabs.TabPane>

                    <Tabs.TabPane key="user">
                        {/* <h3 className="text-xl font-semibold mb-4 border-b p-3">User Settings</h3>
                        <p>Nội dung tab User…</p> */}
                        <UserTabContent />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default SettingsPage;
