import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User, OtpToken, Plan } from "@/lib/models";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { name, username, whatsapp, email, password, referralCode, otpCode, plan } = await req.json();

        // 1. Validate Input
        if (!name || !username || !whatsapp || !password || !referralCode || !otpCode || !plan) {
            return NextResponse.json({ error: "All required fields (Name, Username, WhatsApp, Password, Referral Code, OTP, Plan) must be filled" }, { status: 400 });
        }

        // 2. Check if User already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { whatsapp }, { email: email || "null_email" }]
        });

        if (existingUser) {
            if (existingUser.username === username) return NextResponse.json({ error: "Username already taken" }, { status: 400 });
            if (existingUser.whatsapp === whatsapp) return NextResponse.json({ error: "WhatsApp number already registered" }, { status: 400 });
            if (email && existingUser.email === email) return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        // 3. Validate OTP
        const otp = await OtpToken.findOne({ code: otpCode, status: "unused" });
        if (!otp) {
            return NextResponse.json({ error: "Invalid or used OTP Code" }, { status: 400 });
        }

        // 4. Validate Upliner
        const upliner = await User.findOne({ username: referralCode });
        if (!upliner) {
            return NextResponse.json({ error: "Invalid Referral Code (Upliner Username not found)" }, { status: 400 });
        }

        // 5. Validate Plan from DB
        const selectedPlan = await Plan.findOne({ name: plan, isActive: true });
        if (!selectedPlan) {
            return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
        }

        // 6. Create User
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            username,
            whatsapp,
            email,
            password: hashedPassword,
            role: plan,
            referralCode: username,
            uplinerId: upliner ? upliner._id : null,
            referralBalance: 0,
            taskBalance: 0,
            credits: 0,
        });

        // 7. Mark OTP as used
        otp.status = "used";
        otp.usedBy = newUser._id;
        await otp.save();

        // 8. Process Referral Bonus
        if (upliner) {
            const bonusAmount = selectedPlan.referralReward;
            upliner.referralBalance += bonusAmount;
            await upliner.save();
        }

        return NextResponse.json({ message: "Account created successfully", userId: newUser._id }, { status: 201 });

    } catch (error: any) {
        console.error("Signup Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
