import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { OtpToken } from "@/lib/models";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const otps = await OtpToken.find({ creatorId: userId }).sort({ createdAt: -1 });

        return NextResponse.json({ otps }, { status: 200 });

    } catch (error: any) {
        console.error("Fetch OTPs Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
