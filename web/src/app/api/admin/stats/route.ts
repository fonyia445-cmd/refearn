import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User, Task, UserTask, Transaction } from "@/lib/models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Helper to verify admin
async function verifyAdmin(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "admin") return null;
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Basic Counts
        const totalUsers = await User.countDocuments();
        const totalTasks = await Task.countDocuments();
        const totalSubmissions = await UserTask.countDocuments();
        const pendingSubmissions = await UserTask.countDocuments({ status: "pending" });

        // Financials
        // 1. Total Referral Balance (Amount currently held by users)
        const users = await User.find().select("referralBalance taskBalance role");
        const totalReferralBalance = users.reduce((sum, user) => sum + (user.referralBalance || 0), 0);
        const totalTaskBalance = users.reduce((sum, user) => sum + (user.taskBalance || 0), 0);

        // 2. Estimated Revenue from Signups (Based on role)
        // Lite: 1000, Pro: 3000, Premium: 5000
        const roleCounts: any = {};
        users.forEach(u => {
            roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
        });

        const revenue =
            (roleCounts["lite"] || 0) * 1000 +
            (roleCounts["pro"] || 0) * 3000 +
            (roleCounts["premium"] || 0) * 5000;

        // 3. Total Referral Payouts (50% of revenue)
        // This is an estimate. In a real system, we'd track actual transactions.
        const referralPayouts = revenue * 0.5;

        // 4. Net Balance
        const netBalance = revenue - referralPayouts - totalTaskBalance;

        return NextResponse.json({
            totalUsers,
            totalTasks,
            totalSubmissions,
            pendingSubmissions,
            totalReferralBalance,
            totalTaskBalance,
            financials: {
                revenue,
                referralPayouts,
                netBalance
            }
        });

    } catch (error) {
        console.error("Stats Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
