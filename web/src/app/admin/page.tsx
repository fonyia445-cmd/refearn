"use client";

import { useAuth } from "@/context/AuthContext";
import { Users, CheckSquare, Clock, DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchStats();
        }
    }, [token]);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-white">Admin Overview</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-500/20 p-3 rounded-lg text-blue-500">
                            <Users size={24} />
                        </div>
                        <div>
                            <div className="text-white/60 text-sm">Total Users</div>
                            <div className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-500/20 p-3 rounded-lg text-purple-500">
                            <CheckSquare size={24} />
                        </div>
                        <div>
                            <div className="text-white/60 text-sm">Total Tasks</div>
                            <div className="text-2xl font-bold text-white">{stats?.totalTasks || 0}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-500/20 p-3 rounded-lg text-green-500">
                            <CheckSquare size={24} />
                        </div>
                        <div>
                            <div className="text-white/60 text-sm">Submissions</div>
                            <div className="text-2xl font-bold text-white">{stats?.totalSubmissions || 0}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-500/20 p-3 rounded-lg text-yellow-500">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="text-white/60 text-sm">Pending Review</div>
                            <div className="text-2xl font-bold text-white">{stats?.pendingSubmissions || 0}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Overview */}
            <h2 className="text-xl font-bold text-white">Financial Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-green-500/20 p-3 rounded-lg text-green-500">
                            <TrendingUp size={24} />
                        </div>
                        <div className="text-white/60 text-sm">Total Revenue (Signups)</div>
                    </div>
                    <div className="text-3xl font-bold text-white">₦{stats?.financials?.revenue?.toLocaleString() || 0}</div>
                    <p className="text-xs text-white/40 mt-2">Estimated based on user plans</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-red-500/20 p-3 rounded-lg text-red-500">
                            <TrendingDown size={24} />
                        </div>
                        <div className="text-white/60 text-sm">Total Payouts (Referrals)</div>
                    </div>
                    <div className="text-3xl font-bold text-white">₦{stats?.financials?.referralPayouts?.toLocaleString() || 0}</div>
                    <p className="text-xs text-white/40 mt-2">50% of plan fees</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-500/20 p-3 rounded-lg text-blue-500">
                            <Wallet size={24} />
                        </div>
                        <div className="text-white/60 text-sm">Net Balance</div>
                    </div>
                    <div className="text-3xl font-bold text-primary">₦{stats?.financials?.netBalance?.toLocaleString() || 0}</div>
                    <p className="text-xs text-white/40 mt-2">Revenue - Payouts - Task Rewards</p>
                </div>
            </div>

            {/* User Balances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="text-white/60 text-sm mb-1">Total User Referral Balance</div>
                    <div className="text-2xl font-bold text-white">₦{stats?.totalReferralBalance?.toLocaleString() || 0}</div>
                    <p className="text-xs text-white/40 mt-1">Pending withdrawal</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="text-white/60 text-sm mb-1">Total User Task Balance</div>
                    <div className="text-2xl font-bold text-white">₦{stats?.totalTaskBalance?.toLocaleString() || 0}</div>
                    <p className="text-xs text-white/40 mt-1">Pending withdrawal</p>
                </div>
            </div>
        </div>
    );
}
