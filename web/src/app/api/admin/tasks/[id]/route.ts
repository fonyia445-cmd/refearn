import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { UserTask, User } from "@/lib/models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: taskId } = await params;
        const submissions = await UserTask.find({ taskId }).sort({ submittedAt: -1 });

        // Populate user details manually since we might not have set up refs perfectly or for performance
        const userIds = submissions.map(s => s.userId);
        const users = await User.find({ _id: { $in: userIds } }).select("name username");
        const userMap = users.reduce((acc: any, user) => {
            acc[user._id.toString()] = user;
            return acc;
        }, {});

        const enrichedSubmissions = submissions.map(sub => ({
            ...sub.toObject(),
            user: userMap[sub.userId] || { name: "Unknown", username: "unknown" }
        }));

        return NextResponse.json({ submissions: enrichedSubmissions });

    } catch (error) {
        console.error("Fetch Submissions Error:", error);
        return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
    }
}
