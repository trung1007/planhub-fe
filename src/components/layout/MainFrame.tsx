"use client";

import { usePathname } from "next/navigation";
import BreadCrumb from "../BreadCrumb";
import { useEffect, useState } from "react";
import { menuItems, MenuItem } from "./SideBar";

interface MainFrameProps {
    children: React.ReactNode;
}

const MainFrame = ({ children }: MainFrameProps) => {
    const pathname = usePathname();
    const [activeMenu, setActiveMenu] = useState<MenuItem | null>(null);

    useEffect(() => {

        if(pathname === '/user'){
            const userDetailPath:MenuItem = {
                label:'User',
                href:'/user'
            }
            setActiveMenu(userDetailPath)
            return
        }

        let path = pathname;

        if (pathname === "/") {
            path = "/issue";
        }

        const active = menuItems.find(item =>
            path === item.href || path.startsWith(item.href + "/")
        ) || null;

        setActiveMenu(active);
    }, [pathname]);

    if (pathname === "/login" || pathname === '/forgot-password' || pathname === '/register') return (
        <div className="flex-1 w-full h-full">
            {children}
        </div>
    );
  
    return (
        <div className="px-6 py-3 flex-1 w-full h-full min-h-0 bg-background flex flex-col ">
            <BreadCrumb
                items={[
                    { label: "Home", href: "/" },
                    activeMenu
                        ? { label: activeMenu.label, href: activeMenu.href }
                        : { label: "Loading..." }
                ]}
            />

            {children}
        </div>
    );
};

export default MainFrame;
