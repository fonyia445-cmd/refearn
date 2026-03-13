"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function PaymentApprovals() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await fetch("/api/admin/payments");
            const data = await res.json();
            if (data.transactions) setTransactions(data.transactions);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleAction = async (id: string, action: "approve" | "reject") => {
        if (!confirm(`Are you sure you want to ${action} this payment?`)) return;

        try {
            const res = await fetch("/api/admin/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactionId: id, action }),
            });

            if (res.ok) {
                fetchTransactions(); // Refresh list
            } else {
                alert("Action failed");
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Payment Approvals</h2>
                <p className="text-white/60">Review and approve credit purchase requests from Guiders.</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-left text-sm text-white/70">
                    <thead className="bg-white/5 text-white font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Guider</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Transaction Hash</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {transactions.map((tx) => (
                            <tr key={tx._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{tx.userId?.name || "Unknown"}</div>
                                    <div className="text-xs opacity-50">{tx.userId?.email}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-primary">{tx.amount} Credits</td>
                                <td className="px-6 py-4 font-mono text-xs bg-black/20 rounded max-w-[200px] truncate">
                                    {tx.hash}
                                </td>
                                <td className="px-6 py-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => handleAction(tx._id, "approve")}
                                        className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                                        title="Approve"
                                    >
                                        <CheckCircle className="size-5" />
                                    </button>
                                    <button
                                        onClick={() => handleAction(tx._id, "reject")}
                                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                        title="Reject"
                                    >
                                        <XCircle className="size-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                                    No pending payments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
