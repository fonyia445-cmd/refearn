import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Plan } from "@/lib/models";

export async function GET() {
    try {
        await dbConnect();
        const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
        return NextResponse.json({ plans });
    } catch (error) {
        console.error("GET /api/plans Error:", error);
        return NextResponse.json({ error: "Failed to fetch plans", details: String(error) }, { status: 500 });
    }
}
