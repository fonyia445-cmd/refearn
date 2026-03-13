import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User, OtpToken } from "@/lib/models";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user || user.role !== "guider") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (user.credits < 1) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
        }

        // Deduct credit
        user.credits -= 1;
        await user.save();

        // Generate OTP
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const otp = await OtpToken.create({
            code,
            creatorId: userId,
            status: "unused",
        });

        return NextResponse.json({ message: "OTP Generated", otp, credits: user.credits }, { status: 201 });

    } catch (error: any) {
        console.error("Generate OTP Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
