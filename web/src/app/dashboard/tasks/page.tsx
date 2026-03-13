"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, ExternalLink, Facebook, Instagram, Twitter, Youtube, MessageCircle, Share2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Task } from "@/types";

// Helper for platform icons
const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case "facebook": return <Facebook className="text-blue-500" />;
        case "twitter": return <Twitter className="text-sky-400" />;
        case "instagram": return <Instagram className="text-pink-500" />;
        case "youtube": return <Youtube className="text-red-500" />;
        case "whatsapp": return <MessageCircle className="text-green-500" />;
        case "tiktok": return <span className="font-bold text-white">TikTok</span>;
        default: return <Share2 className="text-white" />;
    }
};

export default function TasksPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState<string | null>(null);

    // Mock tasks for now (replace with API call later)
    useEffect(() => {
        // Simulate fetching tasks
        const MOCK_TASKS: Task[] = [
            {
                id: "1",
                title: "Follow us on Twitter",
                description: "Follow our official Twitter account for updates.",
                reward: 500,
                type: "social",
                platform: "twitter",
                link: "https://twitter.com/refearn",
                targetTiers: ["lite", "pro", "premium"],
                expiryDate: "2025-12-31",
                createdAt: new Date().toISOString()
            },
            {
                id: "2",
                title: "Join WhatsApp Group",
                description: "Join our community group for tips.",
                reward: 300,
                type: "social",
                platform: "whatsapp",
                link: "https://chat.whatsapp.com/...",
                targetTiers: ["pro", "premium"],
                expiryDate: "2025-12-31",
                createdAt: new Date().toISOString()
            },
            {
                id: "3",
                title: "Watch Intro Video",
                description: "Watch our introduction video on YouTube.",
                reward: 1000,
                type: "video",
                platform: "youtube",
                link: "https://youtube.com/watch?v=...",
                targetTiers: ["lite", "pro", "premium"],
                expiryDate: "2024-01-01", // Expired
                createdAt: new Date().toISOString()
            },
        ];
        setTasks(MOCK_TASKS);
        setLoading(false);
    }, []);

    if (loading) return <div className="text-white">Loading tasks...</div>;

    // Filter tasks:
    // 1. Must target user's tier
    // 2. Must not be expired
    const availableTasks = tasks.filter(task => {
        const isTierMatch = task.targetTiers.includes(user?.role || "lite");
        const isExpired = task.expiryDate ? new Date(task.expiryDate) < new Date() : false;
        return isTierMatch && !isExpired;
    });

    const handleTaskAction = (task: Task) => {
        if (task.link) {
            window.open(task.link, "_blank");
        }
    };

    const handleSubmit = async (taskId: string) => {
        setSubmitting(taskId);
        // Simulate API call
        setTimeout(() => {
            setSubmitting(null);
            alert("Task submitted for review!");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Available Tasks</h1>
                <div className="text-sm text-white/60">
                    Showing tasks for <span className="text-primary font-bold uppercase">{user?.role}</span> tier
                </div>
            </div>

            <div className="grid gap-4">
                {availableTasks.map((task) => (
                    <div key={task.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/10 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="bg-black/20 p-3 rounded-lg">
                                <PlatformIcon platform={task.platform} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{task.title}</h3>
                                <p className="text-white/60 text-sm mb-2">{task.description}</p>
                                <div className="flex gap-3 text-xs font-medium">
                                    <span className="bg-primary/20 text-primary px-2 py-1 rounded">
                                        +₦{task.reward}
                                    </span>
                                    <span className="bg-white/10 text-white/70 px-2 py-1 rounded capitalize">
                                        {task.type}
                                    </span>
                                    {task.expiryDate && (
                                        <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded flex items-center gap-1">
                                            <Clock size={12} /> Expires: {task.expiryDate}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {task.link && (
                                <button
                                    onClick={() => handleTaskAction(task)}
                                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 text-sm font-bold"
                                >
                                    <ExternalLink size={16} /> Open Link
                                </button>
                            )}
                            <button
                                onClick={() => handleSubmit(task.id)}
                                disabled={submitting === task.id}
                                className="px-6 py-2 bg-primary text-background-dark rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                            >
                                {submitting === task.id ? "Submitting..." : "Submit Proof"}
                            </button>
                        </div>
                    </div>
                ))}

                {availableTasks.length === 0 && (
                    <div className="text-center py-12 text-white/40">
                        <p>No tasks available for your tier at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
