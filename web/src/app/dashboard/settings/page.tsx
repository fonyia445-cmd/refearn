"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const { user, token, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        whatsapp: "",
        profilePhoto: "",
    });

    // Sync form with user data when user loads
    useEffect(() => {
        if (user) {
            setFormData({
                whatsapp: user.whatsapp || "",
                profilePhoto: user.profilePhoto || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/user/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update profile");
            }

            setMessage("Profile updated successfully!");
            // Refresh user context to reflect changes
            await refreshUser();
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-white mb-6">Account Settings</h1>

            {message && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Read Only Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={user?.name || ""}
                            disabled
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/50 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Username (Referral Code)</label>
                        <input
                            type="text"
                            value={user?.username || ""}
                            disabled
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/50 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Editable Fields */}
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">WhatsApp Number</label>
                    <input
                        type="text"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Profile Photo URL</label>
                    <input
                        type="text"
                        name="profilePhoto"
                        value={formData.profilePhoto}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                        placeholder="https://..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-background-dark font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
