import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/lib/models";
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

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const role = searchParams.get("role");
        const search = searchParams.get("search");

        const query: any = {};

        if (role && role !== "all") {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
                { whatsapp: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (page - 1) * limit;

        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        return NextResponse.json({
            users,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId, action, role } = await req.json();

        if (action === "toggle_suspension") {
            const user = await User.findById(userId);
            if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

            user.isSuspended = !user.isSuspended;
            await user.save();
            return NextResponse.json({ message: "User status updated", user });
        }

        if (action === "update_role") {
            const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
            return NextResponse.json({ message: "User role updated", user });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
