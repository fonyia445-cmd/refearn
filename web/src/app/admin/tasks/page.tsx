"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Task } from "@/types";
import { Plus, Trash2, ExternalLink, Clock } from "lucide-react";

export default function AdminTasksPage() {
    const { token } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        reward: 0,
        type: "social",
        platform: "all",
        link: "",
        targetTiers: ["lite", "pro", "premium"],
        expiryDate: ""
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/admin/tasks", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.tasks) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            const res = await fetch(`/api/admin/tasks?id=${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setTasks(tasks.filter(t => t.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setTasks([data.task, ...tasks]);
                setShowForm(false);
                setFormData({
                    title: "",
                    description: "",
                    reward: 0,
                    type: "social",
                    platform: "all",
                    link: "",
                    targetTiers: ["lite", "pro", "premium"],
                    expiryDate: ""
                });
            }
        } catch (error) {
            console.error("Failed to create task", error);
        }
    };

    if (loading) return <div className="text-white">Loading tasks...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Task Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary text-background-dark px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                >
                    <Plus size={18} /> {showForm ? "Cancel" : "Create Task"}
                </button>
            </div>

            {showForm && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">New Task</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/60 text-sm mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm mb-1">Reward (₦)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.reward}
                                    onChange={e => setFormData({ ...formData, reward: Number(e.target.value) })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                >
                                    <option value="social">Social</option>
                                    <option value="video">Video</option>
                                    <option value="action">Action</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm mb-1">Platform</label>
                                <select
                                    value={formData.platform}
                                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                >
                                    <option value="all">All</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="twitter">Twitter</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="youtube">YouTube</option>
                                    <option value="tiktok">TikTok</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-white/60 text-sm mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                    rows={3}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-white/60 text-sm mb-1">Link</label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg mt-4">
                            Create Task
                        </button>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {tasks.map((task) => (
                    <div key={task.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                                <span className="bg-white/10 text-white/70 px-2 py-1 rounded capitalize">
                                    {task.platform}
                                </span>
                                {task.expiryDate && (
                                    <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded flex items-center gap-1">
                                        <Clock size={12} /> {new Date(task.expiryDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <a
                                href={`/admin/tasks/${task.id}`}
                                className="p-2 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition-colors"
                                title="View Submissions"
                            >
                                <ExternalLink size={18} />
                            </a>
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                                title="Delete Task"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
