import { loadEnvConfig } from '@next/env';
import path from 'path';

// Load environment variables from Next.js (.env.local)
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import dbConnect from '../lib/db';
import { Plan, User, Task } from '../lib/models';
import bcrypt from 'bcryptjs';

async function seed() {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected!');

    console.log('Clearing existing data...');
    await Plan.deleteMany({});
    await User.deleteMany({});
    await Task.deleteMany({});

    console.log('Creating Plans...');
    const plans = await Plan.insertMany([
        {
            name: "lite",
            displayName: "Lite Plan",
            price: 500, // example price
            referralReward: 200,
            features: ["Basic Tasks", "Standard Referrals"],
            durationDays: 30
        },
        {
            name: "pro",
            displayName: "Pro Plan",
            price: 1500,
            referralReward: 500,
            features: ["Video Tasks", "Pro Referrals", "Higher Task Rewards"],
            durationDays: 30
        },
        {
            name: "premium",
            displayName: "Premium Plan",
            price: 5000,
            referralReward: 2000,
            features: ["All Tasks", "Max Referrals", "Premium Support"],
            durationDays: 30
        }
    ]);
    console.log(`Created ${plans.length} plans.`);

    console.log('Creating Admin User and Mock User...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('password123', 10);
    
    const adminUser = await User.create({
        name: "Admin User",
        username: "admin",
        whatsapp: "+0987654321",
        email: "admin@refearn.com",
        password: hashedPassword,
        role: "admin",
        referralCode: "ADMINREF",
        referralBalance: 0,
        taskBalance: 0,
        credits: 100000,
    });

    const alexUser = await User.create({
        name: "Alex User",
        username: "alexuser",
        whatsapp: "+1234567890",
        email: "alex@example.com",
        password: userPassword,
        role: "pro",
        referralCode: "ALEXREF",
        referralBalance: 12000,
        taskBalance: 500,
        credits: 0,
        isSuspended: false,
    });

    console.log('Users created:', adminUser.email, alexUser.email);

    console.log('Creating Sample Tasks from mock data...');
    const tasks = await Task.insertMany([
        {
            title: "Watch Intro Video",
            description: "Watch the 2-minute introduction video.",
            reward: 500,
            type: "video",
            platform: "youtube",
            targetTiers: ["lite", "pro", "premium"]
        },
        {
            title: "Join Telegram",
            description: "Join our official Telegram channel.",
            reward: 200,
            type: "social",
            platform: "all",
            targetTiers: ["lite", "pro", "premium"]
        }
    ]);
    console.log(`Created ${tasks.length} tasks.`);

    console.log('Database seeded successfully!');
    process.exit(0);
}

seed().catch((error) => {
    console.error('Error seeding the database:', error);
    process.exit(1);
});
