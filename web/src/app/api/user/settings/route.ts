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

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const decoded = await verifyUser(req);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { whatsapp, profilePhoto } = await req.json();

        // Validate inputs
        if (!whatsapp) {
            return NextResponse.json({ error: "WhatsApp number is required" }, { status: 400 });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            { whatsapp, profilePhoto },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                username: updatedUser.username,
                whatsapp: updatedUser.whatsapp,
                email: updatedUser.email,
                role: updatedUser.role,
                referralBalance: updatedUser.referralBalance,
                taskBalance: updatedUser.taskBalance,
                credits: updatedUser.credits,
                referralCode: updatedUser.referralCode,
                uplinerId: updatedUser.uplinerId,
                isSuspended: updatedUser.isSuspended,
                joinedAt: updatedUser.createdAt,
                profilePhoto: updatedUser.profilePhoto
            }
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
