import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/lib/models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "Token required" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
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
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
