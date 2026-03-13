import { User, Task, UserTask } from "@/types";

// Initial Mock Data
const MOCK_USERS: User[] = [
    {
        id: "u1",
        name: "Alex User",
        username: "alexuser",
        whatsapp: "+1234567890",
        email: "alex@example.com",
        role: "pro",
        referralBalance: 12000,
        taskBalance: 500,
        credits: 0,
        isSuspended: false,
        joinedAt: new Date().toISOString(),
    },
    {
        id: "a1",
        name: "Admin User",
        username: "admin",
        whatsapp: "+0987654321",
        email: "admin@refearn.com",
        role: "admin",
        referralBalance: 0,
        taskBalance: 0,
        credits: 0,
        isSuspended: false,
        joinedAt: new Date().toISOString(),
    },
];

const MOCK_TASKS: Task[] = [
    {
        id: "t1",
        title: "Watch Intro Video",
        description: "Watch the 2-minute introduction video.",
        reward: 500,
        type: "video",
        platform: "youtube",
        targetTiers: ["lite", "pro", "premium"],
        createdAt: new Date().toISOString(),
    },
    {
        id: "t2",
        title: "Join Telegram",
        description: "Join our official Telegram channel.",
        reward: 200,
        type: "social",
        platform: "all",
        targetTiers: ["lite", "pro", "premium"],
        createdAt: new Date().toISOString(),
    },
];

class MockStore {
    private users: User[] = [...MOCK_USERS];
    private tasks: Task[] = [...MOCK_TASKS];
    private userTasks: UserTask[] = [];

    // User Methods
    getUsers() {
        return this.users;
    }

    getUser(id: string) {
        return this.users.find((u) => u.id === id);
    }

    updateUserBalance(userId: string, amount: number, type: "referral" | "task") {
        const user = this.users.find((u) => u.id === userId);
        if (user) {
            if (type === "referral") user.referralBalance += amount;
            if (type === "task") user.taskBalance += amount;
        }
    }

    toggleUserSuspension(userId: string) {
        const user = this.users.find((u) => u.id === userId);
        if (user) user.isSuspended = !user.isSuspended;
    }

    // Task Methods
    getTasks() {
        return this.tasks;
    }

    addTask(task: Task) {
        this.tasks.push(task);
    }

    // User Task Methods
    submitTask(userId: string, taskId: string) {
        const userTask: UserTask = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            taskId,
            status: "pending",
            submittedAt: new Date().toISOString(),
        };
        this.userTasks.push(userTask);
        return userTask;
    }

    getUserTasks(userId: string) {
        return this.userTasks.filter((ut) => ut.userId === userId);
    }

    getAllPendingTasks() {
        return this.userTasks.filter((ut) => ut.status === "pending");
    }

    approveTask(userTaskId: string) {
        const ut = this.userTasks.find((t) => t.id === userTaskId);
        if (ut && ut.status === "pending") {
            ut.status = "approved";
            const task = this.tasks.find((t) => t.id === ut.taskId);
            if (task) {
                this.updateUserBalance(ut.userId, task.reward, "task");
            }
        }
    }

    rejectTask(userTaskId: string) {
        const ut = this.userTasks.find((t) => t.id === userTaskId);
        if (ut) {
            ut.status = "rejected";
        }
    }
}

export const store = new MockStore();
