import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Transaction, User } from "@/lib/models";

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Fetch pending transactions with user details
        const transactions = await Transaction.find({ status: "pending" })
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        return NextResponse.json({ transactions }, { status: 200 });
    } catch (error: any) {
        console.error("Fetch Transactions Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { transactionId, action } = await req.json(); // action: "approve" | "reject"

        if (!transactionId || !action) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        if (transaction.status !== "pending") {
            return NextResponse.json({ error: "Transaction already processed" }, { status: 400 });
        }

        if (action === "approve") {
            transaction.status = "approved";
            // Add credits to user
            const user = await User.findById(transaction.userId);
            if (user) {
                user.credits += transaction.amount;
                await user.save();
            }
        } else if (action === "reject") {
            transaction.status = "rejected";
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        await transaction.save();

        return NextResponse.json({ message: `Transaction ${action}d` }, { status: 200 });

    } catch (error: any) {
        console.error("Process Transaction Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
