"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Phone, Lock, Users, Key, CreditCard, AlertCircle } from "lucide-react";

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refCode = searchParams.get("ref") || "";
    const selectedPlan = searchParams.get("plan") || "lite";

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        whatsapp: "",
        email: "",
        password: "",
        confirmPassword: "",
        referralCode: refCode,
        otpCode: "",
        plan: selectedPlan
    });

    const [plans, setPlans] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch plans from database
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch("/api/plans");
                const data = await res.json();
                if (data.plans) setPlans(data.plans);
            } catch (error) {
                console.error("Failed to fetch plans", error);
            }
        };
        fetchPlans();
    }, []);

    useEffect(() => {
        if (refCode) setFormData(prev => ({ ...prev, referralCode: refCode }));
        if (selectedPlan) setFormData(prev => ({ ...prev, plan: selectedPlan }));
    }, [refCode, selectedPlan]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Signup failed");
            }

            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark p-4">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
                        Create Account
                    </h1>
                    <p className="text-white/60">Join Refearn and start earning today</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                            <input
                                type="text"
                                name="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="johndoe123"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">WhatsApp Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                            <input
                                type="tel"
                                name="whatsapp"
                                required
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="+1234567890"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Email (Optional)</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">Confirm</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">Referral Code</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                                <input
                                    type="text"
                                    name="referralCode"
                                    required
                                    value={formData.referralCode}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="Upliner Code"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">OTP Code</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                                <input
                                    type="text"
                                    name="otpCode"
                                    required
                                    value={formData.otpCode}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="From Guider"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Select Plan</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                            <select
                                name="plan"
                                value={formData.plan}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-primary/50 transition-colors bg-background-dark"
                            >
                                {plans.length === 0 ? (
                                    <option value="lite">Loading plans...</option>
                                ) : (
                                    plans.map(p => (
                                        <option key={p._id} value={p.name} className="bg-gray-900">
                                            {p.displayName} - ₦{p.price.toLocaleString()}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>

                    <div className="mt-6 text-center text-sm text-white/60">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background-dark text-white">Loading...</div>}>
            <SignupForm />
        </Suspense>
    );
}
