import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User, CreditCode } from "@/lib/models";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
    try {
        await dbConnect();

        // 1. Auth Check
        const headersList = await headers();
        const token = headersList.get("cookie")?.split("token=")[1]?.split(";")[0];

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.role !== "guider") {
            return NextResponse.json({ error: "Only Guiders can generate credit codes" }, { status: 403 });
        }

        const { amount } = await req.json();
        const value = parseInt(amount);

        if (!value || value <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // 2. Check Balance
        if (user.credits < value) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
        }

        // 3. Deduct Credits
        user.credits -= value;
        await user.save();

        // 4. Generate Code
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();

        const newCode = await CreditCode.create({
            code,
            value,
            creatorId: user._id,
            status: "unused"
        });

        return NextResponse.json({ message: "Credit Code generated", code: newCode }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();

        // 1. Auth Check
        const headersList = await headers();
        const token = headersList.get("cookie")?.split("token=")[1]?.split(";")[0];

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, JWT_SECRET);

        // Fetch codes created by this guider
        const codes = await CreditCode.find({ creatorId: decoded.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ codes });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
