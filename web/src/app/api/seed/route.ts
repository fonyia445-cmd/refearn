import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User, Plan } from "@/lib/models";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await dbConnect();

        // --- Seed Plans ---
        const plans = [
            {
                name: "lite",
                displayName: "Lite Plan",
                price: 2000,
                referralReward: 1000,
                features: ["Access to basic tasks", "Standard support", "Valid for 30 days"]
            },
            {
                name: "pro",
                displayName: "Pro Plan",
                price: 6000,
                referralReward: 3000,
                features: ["Access to all tasks", "Priority support", "Higher task rewards", "Valid for 30 days"]
            },
            {
                name: "premium",
                displayName: "Premium Plan",
                price: 10000,
                referralReward: 5000,
                features: ["Access to exclusive tasks", "24/7 Support", "Highest task rewards", "Valid for 30 days"]
            }
        ];

        for (const plan of plans) {
            await Plan.findOneAndUpdate({ name: plan.name }, plan, { upsert: true, new: true });
        }

        // --- Seed Users ---
        const users = [
            {
                name: "Super Admin",
                username: "admin",
                whatsapp: "0000000000",
                email: "admin@refearn.com",
                password: "password123",
                role: "admin",
                credits: 1000,
            },
            {
                name: "Guider User",
                username: "guider",
                whatsapp: "1111111111",
                email: "guider@refearn.com",
                password: "password123",
                role: "guider",
                credits: 50,
            },
            {
                name: "Premium User",
                username: "premium",
                whatsapp: "2222222222",
                email: "premium@refearn.com",
                password: "password123",
                role: "premium",
            },
            {
                name: "Pro User",
                username: "pro",
                whatsapp: "3333333333",
                email: "pro@refearn.com",
                password: "password123",
                role: "pro",
            },
            {
                name: "Lite User",
                username: "lite",
                whatsapp: "4444444444",
                email: "lite@refearn.com",
                password: "password123",
                role: "lite",
            },
        ];

        const createdUsers = [];

        for (const user of users) {
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                const newUser = await User.create({
                    ...user,
                    referralCode: user.username,
                    password: hashedPassword,
                });
                createdUsers.push(newUser.username);
            }
        }

        return NextResponse.json({
            message: "Database seeded successfully (Plans + Users)",
            created: createdUsers,
        });

    } catch (error: any) {
        console.error("Seeding Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
