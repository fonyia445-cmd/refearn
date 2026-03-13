import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { AdCampaign, CreditCode } from "@/lib/models";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { platform, actionType, link, targetCount, creditCode, contactInfo, image } = await req.json();

        // 1. Validate Input
        if (!platform || !actionType || !link || !targetCount || !creditCode) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // 2. Calculate Cost
        const PRICING: any = {
            view: 10,
            follow: 50,
            comment: 100,
            like: 20,
            share: 50
        };

        const costPerAction = PRICING[actionType.toLowerCase()] || 100;
        const totalCost = costPerAction * parseInt(targetCount);

        // 3. Validate Credit Code
        const code = await CreditCode.findOne({ code: creditCode, status: "unused" });
        if (!code) {
            return NextResponse.json({ error: "Invalid or used Credit Code" }, { status: 400 });
        }

        if (code.value < totalCost) {
            return NextResponse.json({
                error: `Insufficient credit value. Code value: ${code.value}, Required: ${totalCost}`
            }, { status: 400 });
        }

        // 4. Create Campaign
        const newCampaign = await AdCampaign.create({
            platform,
            actionType,
            link,
            image,
            targetCount,
            costPerAction,
            totalCost,
            creditCode,
            contactInfo,
            status: "active"
        });

        // 5. Mark Code as Used
        code.status = "used";
        code.usedFor = "ad_campaign";
        code.usedAt = new Date();
        await code.save();

        return NextResponse.json({ message: "Campaign created successfully", campaign: newCampaign }, { status: 201 });

    } catch (error: any) {
        console.error("Ad Creation Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
