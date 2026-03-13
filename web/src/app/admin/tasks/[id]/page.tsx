"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, ExternalLink, Clock } from "lucide-react";

interface Submission {
    _id: string;
    userId: string;
    taskId: string;
    status: "pending" | "approved" | "rejected";
    proof?: string;
    submittedAt: string;
    user: {
        name: string;
        username: string;
    };
}

export default function TaskSubmissionsPage() {
    const { token } = useAuth();
    const params = useParams();
    const router = useRouter();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token && params.id) {
            fetchSubmissions();
        }
    }, [token, params.id]);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch(`/api/admin/tasks/${params.id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.submissions) {
                setSubmissions(data.submissions);
            }
        } catch (error) {
            console.error("Failed to fetch submissions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (submissionId: string, action: "approve" | "reject") => {
        // TODO: Implement API to approve/reject submission
        // For now, just optimistically update UI
        alert(`Action ${action} not yet implemented in API`);
    };

    if (loading) return <div className="text-white">Loading submissions...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-white">Task Submissions</h1>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-white/60">
                    <thead className="bg-white/5 text-white font-bold uppercase text-xs">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Proof</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {submissions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center">No submissions found for this task.</td>
                            </tr>
                        ) : (
                            submissions.map((sub) => (
                                <tr key={sub._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{sub.user.name}</div>
                                        <div className="text-xs">@{sub.user.username}</div>
                                    </td>
                                    <td className="p-4">
                                        {sub.proof ? (
                                            <a
                                                href={sub.proof}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline flex items-center gap-1"
                                            >
                                                View Proof <ExternalLink size={12} />
                                            </a>
                                        ) : (
                                            <span className="text-white/30">No proof provided</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {new Date(sub.submittedAt).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${sub.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                                                sub.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                                                    'bg-yellow-500/20 text-yellow-500'
                                            }`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {sub.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(sub._id, "approve")}
                                                    className="p-1 rounded bg-green-500/20 text-green-500 hover:bg-green-500/30"
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(sub._id, "reject")}
                                                    className="p-1 rounded bg-red-500/20 text-red-500 hover:bg-red-500/30"
                                                    title="Reject"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
