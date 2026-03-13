import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Transaction, User } from "@/lib/models";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { userId, amount, hash } = await req.json();

        if (!userId || !amount || !hash) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user || user.role !== "guider") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const transaction = await Transaction.create({
            userId,
            amount,
            type: "credit_purchase",
            hash,
            status: "pending",
        });

        return NextResponse.json({ message: "Request submitted", transaction }, { status: 201 });

    } catch (error: any) {
        console.error("Buy Credits Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
