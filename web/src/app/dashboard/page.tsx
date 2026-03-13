"use client";

import { useAuth } from "@/context/AuthContext";
import { Users, CheckSquare, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

export default function DashboardPage() {
    const { user, refreshUser } = useAuth();

    useEffect(() => {
        refreshUser();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
                <p className="text-white/60">Welcome back, {user.name}! Here's your financial summary.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Referral Balance */}
                <div className="p-6 rounded-xl border border-primary bg-primary text-background-dark flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                        <div className="p-3 rounded-lg bg-black/10">
                            <Users className="size-6" />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-black/10 text-background-dark">
                            <ArrowUpRight className="size-3" />
                            +12%
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-background-dark/70 mb-1">Referral Balance</p>
                        <h3 className="text-3xl font-black tracking-tight">₦{user.referralBalance.toLocaleString()}</h3>
                    </div>
                </div>

                {/* Task Balance */}
                <div className="p-6 rounded-xl border border-white/10 bg-white/5 text-white flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                        <div className="p-3 rounded-lg bg-white/10">
                            <CheckSquare className="size-6" />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-primary/20 text-primary">
                            <ArrowUpRight className="size-3" />
                            +5%
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white/60 mb-1">Task Balance</p>
                        <h3 className="text-3xl font-black tracking-tight">₦{user.taskBalance.toLocaleString()}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
