"use client";

import { useAuth } from "@/context/AuthContext";
import { Copy, Users, CheckCircle, Ban } from "lucide-react";
import { useState, useEffect } from "react";

interface Referral {
    id: string;
    name: string;
    username: string;
    role: string;
    joinedAt: string;
    isSuspended: boolean;
}

export default function ReferralsPage() {
    const { user, token } = useAuth();
    const [copied, setCopied] = useState(false);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchReferrals();
        }
    }, [token]);

    const fetchReferrals = async () => {
        try {
            const res = await fetch("/api/user/referrals", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.referrals) {
                setReferrals(data.referrals);
            }
        } catch (error) {
            console.error("Failed to fetch referrals", error);
        } finally {
            setLoading(false);
        }
    };

    const referralLink = typeof window !== "undefined" && user?.username
        ? `${window.location.origin}/signup?ref=${user.username}`
        : "Loading...";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const activeReferrals = referrals.filter(r => !r.isSuspended).length;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">My Referrals</h1>

            {/* Referral Link Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Your Referral Link</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white/70 font-mono text-sm truncate">
                        {referralLink}
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="bg-primary text-background-dark font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <Copy size={18} />
                        {copied ? "Copied!" : "Copy Link"}
                    </button>
                </div>
                <p className="mt-4 text-sm text-white/60">
                    Share this link with your friends. You'll earn 50% of their plan fee when they sign up!
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="text-white/60 text-sm mb-1">Total Referrals</div>
                    <div className="text-2xl font-bold text-white">{referrals.length}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="text-white/60 text-sm mb-1">Active Referrals</div>
                    <div className="text-2xl font-bold text-white">{activeReferrals}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="text-white/60 text-sm mb-1">Total Earnings</div>
                    <div className="text-2xl font-bold text-primary">₦{user?.referralBalance?.toLocaleString() || 0}</div>
                </div>
            </div>

            {/* Referral List */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Referral History</h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-white/40">Loading referrals...</div>
                ) : referrals.length === 0 ? (
                    <div className="p-8 text-center text-white/40">
                        <Users className="mx-auto size-12 mb-3 opacity-50" />
                        <p>No referrals yet. Start sharing your link!</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-white/60">
                        <thead className="bg-white/5 text-white font-bold uppercase text-xs">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {referrals.map((ref) => (
                                <tr key={ref.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{ref.name}</div>
                                        <div className="text-xs">@{ref.username}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="capitalize px-2 py-1 bg-white/10 rounded text-xs">
                                            {ref.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {ref.isSuspended ? (
                                            <span className="text-red-500 flex items-center gap-1"><Ban size={14} /> Suspended</span>
                                        ) : (
                                            <span className="text-green-500 flex items-center gap-1"><CheckCircle size={14} /> Active</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {new Date(ref.joinedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
