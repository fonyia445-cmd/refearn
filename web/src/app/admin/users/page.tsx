"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";
import { Search, Shield, Ban, CheckCircle, ChevronLeft, ChevronRight, Filter } from "lucide-react";

export default function AdminUsersPage() {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token, page, roleFilter, searchTerm]); // Re-fetch when filters change

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (token) fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                role: roleFilter,
                search: searchTerm
            });

            const res = await fetch(`/api/admin/users?${queryParams}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.users) {
                setUsers(data.users);
                setTotalPages(data.pagination.pages);
                setTotalUsers(data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSuspension = async (userId: string) => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId, action: "toggle_suspension" })
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, isSuspended: data.user.isSuspended } : u));
            }
        } catch (error) {
            console.error("Failed to toggle suspension", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-white/60 text-sm">Total Users: {totalUsers}</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    {/* Role Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 size-4" />
                        <select
                            value={roleFilter}
                            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-8 py-2 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                        >
                            <option value="all">All Roles</option>
                            <option value="lite">Lite Plan</option>
                            <option value="pro">Pro Plan</option>
                            <option value="premium">Premium Plan</option>
                            <option value="guider">Guider</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 size-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-white/60">
                        <thead className="bg-white/5 text-white font-bold uppercase text-xs">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Balance</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center">Loading...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{user.name}</div>
                                                    <div className="text-xs">@{user.username}</div>
                                                    <div className="text-xs opacity-50">{user.whatsapp}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-red-500/20 text-red-500' :
                                                user.role === 'guider' ? 'bg-purple-500/20 text-purple-500' :
                                                    user.role === 'premium' ? 'bg-yellow-500/20 text-yellow-500' :
                                                        'bg-white/10 text-white'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white">₦{user.referralBalance.toLocaleString()}</div>
                                            <div className="text-xs">Tasks: ₦{user.taskBalance.toLocaleString()}</div>
                                        </td>
                                        <td className="p-4">
                                            {user.isSuspended ? (
                                                <span className="flex items-center gap-1 text-red-500">
                                                    <Ban size={14} /> Suspended
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-green-500">
                                                    <CheckCircle size={14} /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleToggleSuspension(user.id)}
                                                className={`px-3 py-1 rounded text-xs font-bold ${user.isSuspended
                                                    ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                                                    : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                                                    }`}
                                            >
                                                {user.isSuspended ? "Unsuspend" : "Suspend"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-white/10 flex justify-between items-center">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent text-white"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-white/60">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent text-white"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
