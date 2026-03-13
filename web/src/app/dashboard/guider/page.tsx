"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Copy, Plus, RefreshCw, Wallet } from "lucide-react";

export default function GuiderDashboard() {
    const { user } = useAuth();
    const [credits, setCredits] = useState(user?.credits || 0);
    const [otps, setOtps] = useState<any[]>([]);
    const [hash, setHash] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchOtps();
            setCredits(user.credits);
        }
    }, [user]);

    const fetchOtps = async () => {
        if (!user) return;
        const res = await fetch(`/api/guider/otps?userId=${user.id}`);
        const data = await res.json();
        if (data.otps) setOtps(data.otps);
    };

    const handleBuyCredits = async () => {
        if (!hash || !user) return;
        setLoading(true);
        try {
            const res = await fetch("/api/guider/buy-credits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, amount: 10, hash }), // Buying 10 credits fixed for demo
            });
            if (res.ok) {
                alert("Request submitted! Wait for admin approval.");
                setHash("");
            } else {
                alert("Failed to submit request");
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleGenerateOtp = async () => {
        if (!user) return;
        if (credits < 1) {
            alert("Insufficient credits");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/guider/generate-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            });
            const data = await res.json();
            if (res.ok) {
                setCredits(data.credits);
                fetchOtps();
            } else {
                alert(data.error);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Guider Dashboard</h2>
                <p className="text-white/60">Manage credits and generate OTPs for new users.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Credit Balance & Purchase */}
                <div className="space-y-6">
                    <div className="p-6 rounded-xl border border-primary bg-primary text-background-dark flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="p-3 rounded-lg bg-black/10">
                                <Wallet className="size-6" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-background-dark/70 mb-1">Available Credits</p>
                            <h3 className="text-4xl font-black tracking-tight">{credits}</h3>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <h3 className="text-lg font-bold text-white mb-4">Buy Credits</h3>
                        <p className="text-sm text-white/60 mb-4">
                            Send USDT to <code className="bg-black/30 px-2 py-1 rounded text-primary">0x123...ABC</code>
                        </p>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Enter Transaction Hash"
                                value={hash}
                                onChange={(e) => setHash(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                            />
                            <button
                                onClick={handleBuyCredits}
                                disabled={loading || !hash}
                                className="w-full bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Submit Payment Proof"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* OTP Generation */}
                <div className="space-y-6">
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Generated OTPs</h3>
                            <button
                                onClick={handleGenerateOtp}
                                disabled={loading || credits < 1}
                                className="px-4 py-2 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                            >
                                <Plus className="size-4" />
                                Generate New (-1 Credit)
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {otps.map((otp) => (
                                <div key={otp._id} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                                    <div>
                                        <p className="text-xl font-mono font-bold text-primary tracking-wider">{otp.code}</p>
                                        <p className="text-xs text-white/40">
                                            {new Date(otp.createdAt).toLocaleDateString()} •
                                            <span className={otp.status === "used" ? "text-red-400" : "text-green-400"}> {otp.status}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(otp.code)}
                                        className="p-2 text-white/40 hover:text-white transition-colors"
                                    >
                                        <Copy className="size-4" />
                                    </button>
                                </div>
                            ))}
                            {otps.length === 0 && (
                                <p className="text-center text-white/40 py-4">No OTPs generated yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
