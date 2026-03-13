"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Header() {
    const { user } = useAuth();

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-background-dark border-b border-white/10 sticky top-0 z-10">
            <div className="flex items-center gap-4 md:hidden">
                <button className="text-white/70 hover:text-white">
                    <Menu className="size-6" />
                </button>
            </div>

            <div className="hidden md:flex items-center bg-white/5 rounded-lg px-3 py-2 w-96 border border-white/10 focus-within:border-primary/50 transition-colors">
                <Search className="size-4 text-white/50 mr-2" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm text-white placeholder-white/50 w-full"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-white/70 hover:text-white transition-colors">
                    <Bell className="size-5" />
                    <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white">{user?.name || "Guest"}</p>
                        <p className="text-xs text-white/60 capitalize">{user?.role || "Visitor"}</p>
                    </div>
                    <div className="size-10 rounded-full bg-white/10 overflow-hidden border border-white/10 flex items-center justify-center text-primary font-bold">
                        {user?.name?.charAt(0) || "G"}
                    </div>
                </div>
            </div>
        </header>
    );
}
