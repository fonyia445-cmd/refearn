"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdvertisePage() {
    const [formData, setFormData] = useState({
        platform: "instagram",
        actionType: "follow",
        link: "",
        targetCount: 100,
        creditCode: "",
        contactInfo: "",
        image: ""
    });

    const [totalCost, setTotalCost] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const PRICING: any = {
        view: 10,
        follow: 50,
        comment: 100,
        like: 20,
        share: 50
    };

    useEffect(() => {
        const costPerAction = PRICING[formData.actionType] || 0;
        setTotalCost(costPerAction * formData.targetCount);
    }, [formData.actionType, formData.targetCount]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetch("/api/ads/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create campaign");
            }

            setSuccess("Campaign created successfully! Your ads will start running shortly.");
            setFormData({
                platform: "instagram",
                actionType: "follow",
                link: "",
                targetCount: 100,
                creditCode: "",
                contactInfo: "",
                image: ""
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark text-white">
            <nav className="border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        Refearn Ads
                    </Link>
                    <Link href="/" className="text-sm text-white/70 hover:text-white">Back to Home</Link>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Promote Your Content</h1>
                        <p className="text-white/60">Get real engagement from real users. Pay with Guider Credits.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-2">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-lg mb-6 flex items-center gap-2">
                                <CheckCircle size={20} />
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Platform</label>
                                    <select
                                        name="platform"
                                        value={formData.platform}
                                        onChange={handleChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                    >
                                        <option value="instagram" className="bg-gray-900">Instagram</option>
                                        <option value="facebook" className="bg-gray-900">Facebook</option>
                                        <option value="tiktok" className="bg-gray-900">TikTok</option>
                                        <option value="youtube" className="bg-gray-900">YouTube</option>
                                        <option value="whatsapp" className="bg-gray-900">WhatsApp</option>
                                        <option value="website" className="bg-gray-900">Website</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Action Type</label>
                                    <select
                                        name="actionType"
                                        value={formData.actionType}
                                        onChange={handleChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                    >
                                        <option value="view" className="bg-gray-900">View (10 credits)</option>
                                        <option value="like" className="bg-gray-900">Like (20 credits)</option>
                                        <option value="follow" className="bg-gray-900">Follow (50 credits)</option>
                                        <option value="share" className="bg-gray-900">Share (50 credits)</option>
                                        <option value="comment" className="bg-gray-900">Comment (100 credits)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Content Link</label>
                                <input
                                    type="url"
                                    name="link"
                                    required
                                    value={formData.link}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                    placeholder="https://instagram.com/p/..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Image URL (Optional)</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Target Count</label>
                                    <input
                                        type="number"
                                        name="targetCount"
                                        min="10"
                                        required
                                        value={formData.targetCount}
                                        onChange={handleChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Your Contact (Email/Phone)</label>
                                    <input
                                        type="text"
                                        name="contactInfo"
                                        required
                                        value={formData.contactInfo}
                                        onChange={handleChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                        placeholder="For updates on your ad"
                                    />
                                </div>
                            </div>

                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-primary/80 uppercase font-bold tracking-wider">Total Cost</p>
                                    <p className="text-3xl font-bold text-primary">{totalCost.toLocaleString()} Credits</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-white/50">Rate: {PRICING[formData.actionType]} / action</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Guider Credit Code</label>
                                <input
                                    type="text"
                                    name="creditCode"
                                    required
                                    value={formData.creditCode}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors font-mono text-lg tracking-widest"
                                    placeholder="ENTER-CODE-HERE"
                                />
                                <p className="text-xs text-white/40 mt-2">Contact a Guider to purchase a credit code worth at least {totalCost} credits.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-background-dark font-bold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-lg"
                            >
                                {loading ? "Creating Campaign..." : "Launch Campaign"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
