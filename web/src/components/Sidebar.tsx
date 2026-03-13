"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    CheckSquare,
    Users,
    Settings,
    LogOut,
    ShieldCheck,
    Wallet,
    UserCog,
    Shield
} from "lucide-react";
import clsx from "clsx";

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const userLinks = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
        { name: "Referrals", href: "/dashboard/referrals", icon: Users },
        { name: "Guider Panel", href: "/dashboard/guider", icon: Shield, role: "guider" },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const adminLinks = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Tasks", href: "/admin/tasks", icon: CheckSquare },
        { name: "Approvals", href: "/admin/approvals", icon: ShieldCheck },
        { name: "Payments", href: "/admin/payments", icon: Wallet },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const links = user?.role === "admin" ? adminLinks : userLinks;

    return (
        <aside className="hidden md:flex flex-col w-64 bg-background-dark border-r border-white/10 h-screen sticky top-0">
            <div className="p-6 flex items-center gap-3">
                <div className="size-8 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
                    </svg>
                </div>
                <h1 className="text-white text-xl font-bold tracking-tight">ReferEarn</h1>
            </div>

            <div className="px-6 mb-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-xs text-white/50 uppercase font-bold mb-1">Current Role</p>
                    <p className="text-sm font-bold text-primary capitalize">{user?.role || "Guest"}</p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {links.map((item) => {
                    const isActive = pathname === item.href;
                    // @ts-ignore
                    if (item.role && user?.role !== item.role) return null;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className="size-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Link href="/login" onClick={logout} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg w-full transition-colors">
                    <LogOut className="size-5" />
                    Sign Out
                </Link>
            </div>
        </aside>
    );
}
