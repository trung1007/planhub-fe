"use client";

import { useAppSelector } from "@/hooks/reduxHook";
import { useLogoutMutation } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBell, FaRegUser, FaRocket } from "react-icons/fa";

const Header = () => {
    const [openUserMenu, setOpenUserMenu] = useState(false);

    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);


    const menuRef = useRef<HTMLDivElement | null>(null);

    const { mutate, isPending } = useLogoutMutation()

    const handleLogout = () => {
        mutate(undefined, {
            onSuccess: () => {
                setOpenUserMenu(false)
                router.push("/login");
            },
            onError: () => {
                setOpenUserMenu(false)
                router.push("/login");

            }
        });
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenUserMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const goToUserDetail = () => {
        setOpenUserMenu(false)
        router.push("/user");
    }

    const pathname = usePathname();

    if (pathname === "/login" || pathname === '/forgot-password' || pathname === '/register') return null;
    return (
        <header className="w-full h-12 bg-primary flex items-center justify-between px-4">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer " onClick={() => { router.push("/") }}>
                <span className="text-white text-lg font-semibold">PlanHub</span>
                <span className="text-white">
                    <FaRocket />
                </span>
            </div>

            {/* Right Menu */}
            <div className="flex items-center gap-4 text-sm">
                {/* Create button */}
                <button className="bg-white text-[#0c3c60] px-3 py-1 rounded">
                    Create
                </button>

                {/* Workspace dropdown */}
                <div className="flex items-center gap-1 text-white cursor-pointer">
                    <span>Workspace</span>
                    <span>▼</span>
                </div>

                {/* Icons */}
                <div className="text-white flex items-center gap-3">
                    <FaBell className="cursor-pointer" />

                    {/* User Menu */}
                    <div ref={menuRef} className="relative">
                        <FaRegUser
                            className="cursor-pointer"
                            onClick={() => setOpenUserMenu((prev) => !prev)}
                        />

                        {openUserMenu && (
                            <div className="absolute right-0 mt-2 w-50 bg-white shadow-lg rounded-md p-3 text-gray-700 z-50 ">
                                <p className="text-[16px] font-semibold truncate ">{user?.username}</p>
                                <p className=" text-[16px]  text-gray-500 truncate">{user?.email}</p>
                                <i className="text-[12px]  text-gray-500 cursor-pointer hover:underline" onClick={goToUserDetail}>Đổi mật khẩu</i>

                                <button onClick={handleLogout} disabled={isPending} className="w-full bg-second text-white py-1 mt-3 rounded hover:bg-primary">
                                    {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
