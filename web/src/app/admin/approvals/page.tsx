"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export default function ApprovalsPage() {
    const [pendingTasks, setPendingTasks] = useState(store.getAllPendingTasks());
    const users = store.getUsers();
    const tasks = store.getTasks();

    const handleApprove = (id: string) => {
        store.approveTask(id);
        setPendingTasks(store.getAllPendingTasks());
    };

    const handleReject = (id: string) => {
        store.rejectTask(id);
        setPendingTasks(store.getAllPendingTasks());
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Pending Approvals</h2>
                <p className="text-white/60">Review and approve user task submissions.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {pendingTasks.length === 0 ? (
                    <div className="p-10 text-center text-white/40">
                        No pending tasks to review.
                    </div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {pendingTasks.map((userTask) => {
                            const user = users.find((u) => u.id === userTask.userId);
                            const task = tasks.find((t) => t.id === userTask.taskId);

                            return (
                                <div key={userTask.id} className="p-6 flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center flex-shrink-0">
                                        <Clock className="size-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white">{task?.title}</h4>
                                        <p className="text-sm text-white/60">Submitted by <span className="text-white font-medium">{user?.name}</span></p>
                                        <p className="text-xs text-white/40 mt-1">ID: {userTask.id}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleReject(userTask.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
                                            title="Reject"
                                        >
                                            <XCircle className="size-5" />
                                        </button>
                                        <button
                                            onClick={() => handleApprove(userTask.id)}
                                            className="px-4 py-2 rounded-lg bg-primary text-background-dark text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="size-4" />
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
