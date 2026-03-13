export type UserRole = "lite" | "pro" | "premium" | "guider" | "admin";

export interface User {
    id: string;
    name: string;
    username: string;
    whatsapp: string;
    email?: string;
    profilePhoto?: string;
    role: UserRole;
    referralBalance: number;
    taskBalance: number;
    credits: number;
    referralCode?: string;
    uplinerId?: string;
    isSuspended: boolean;
    joinedAt: string;
}

export type TaskStatus = "available" | "pending" | "approved" | "rejected";
export type TaskPlatform = "whatsapp" | "facebook" | "twitter" | "tiktok" | "instagram" | "youtube" | "all";

export interface Task {
    id: string;
    title: string;
    description: string;
    reward: number;
    type: "video" | "social" | "action";
    platform: TaskPlatform;
    link?: string;
    image?: string;
    targetTiers: string[];
    expiryDate?: string;
    createdAt: string;
}

export interface UserTask {
    id: string;
    userId: string;
    taskId: string;
    status: TaskStatus;
    submittedAt: string;
    proof?: string; // URL or text
}
