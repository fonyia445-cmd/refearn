import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/lib/models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

async function verifyUser(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        const decoded = await verifyUser(req);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const referrals = await User.find({ uplinerId: decoded.userId })
            .select("name username role joinedAt isSuspended")
            .sort({ createdAt: -1 });

        return NextResponse.json({ referrals });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 });
    }
}
