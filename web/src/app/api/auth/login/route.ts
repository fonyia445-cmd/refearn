import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/lib/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { identifier, password } = await req.json();

        if (!identifier || !password) {
            return NextResponse.json({ error: "Username/WhatsApp and Password required" }, { status: 400 });
        }

        // Find user by Username OR WhatsApp OR Email (legacy support)
        const user = await User.findOne({
            $or: [{ username: identifier }, { whatsapp: identifier }, { email: identifier }]
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        if (user.isSuspended) {
            return NextResponse.json({ error: "Account suspended" }, { status: 403 });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Return user info + token
        // In a real app, set cookie via headers. For this demo, returning token in body is easier for client handling.
        return NextResponse.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                whatsapp: user.whatsapp,
                email: user.email,
                role: user.role,
                referralBalance: user.referralBalance,
                taskBalance: user.taskBalance,
                credits: user.credits,
                referralCode: user.referralCode,
                uplinerId: user.uplinerId,
                isSuspended: user.isSuspended,
                joinedAt: user.createdAt,
            }
        });

    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
