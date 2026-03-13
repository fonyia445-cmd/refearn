import mongoose, { Schema, model, models } from "mongoose";

// --- User Model ---
const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    whatsapp: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    profilePhoto: { type: String },
    role: {
        type: String,
        enum: ["lite", "pro", "premium", "guider", "admin"],
        default: "lite"
    },
    referralCode: { type: String, unique: true },
    uplinerId: { type: Schema.Types.ObjectId, ref: "User" },
    referralBalance: { type: Number, default: 0 },
    taskBalance: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    isSuspended: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model("User", UserSchema);

// --- OTP Token Model ---
const OtpTokenSchema = new Schema({
    code: { type: String, required: true, unique: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["unused", "used"], default: "unused" },
    usedBy: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});

export const OtpToken = models.OtpToken || model("OtpToken", OtpTokenSchema);

// --- Credit Code Model ---
const CreditCodeSchema = new Schema({
    code: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["unused", "used"], default: "unused" },
    usedFor: { type: String },
    usedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export const CreditCode = models.CreditCode || model("CreditCode", CreditCodeSchema);

// --- Transaction Model ---
const TransactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["credit_purchase", "withdrawal"], required: true },
    hash: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

export const Transaction = models.Transaction || model("Transaction", TransactionSchema);

// --- Task Model ---
const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    reward: { type: Number, required: true },
    type: { type: String, enum: ["video", "social", "action"], required: true },
    platform: {
        type: String,
        enum: ["whatsapp", "facebook", "twitter", "tiktok", "instagram", "youtube", "all"],
        default: "all"
    },
    link: { type: String },
    image: { type: String },
    targetTiers: { type: [String], default: ["lite", "pro", "premium"] },
    expiryDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export const Task = models.Task || model("Task", TaskSchema);

// --- User Task Model ---
const UserTaskSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    proof: { type: String },
    submittedAt: { type: Date, default: Date.now },
});

export const UserTask = models.UserTask || model("UserTask", UserTaskSchema);

// --- Plan Model ---
const PlanSchema = new Schema({
    name: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    price: { type: Number, required: true },
    referralReward: { type: Number, required: true },
    features: [{ type: String }],
    durationDays: { type: Number, default: 30 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Plan = models.Plan || model("Plan", PlanSchema);

// --- Ad Campaign Model ---
const AdCampaignSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    contactInfo: { type: String },
    platform: { type: String, required: true },
    actionType: { type: String, required: true },
    link: { type: String, required: true },
    image: { type: String },
    targetCount: { type: Number, required: true },
    costPerAction: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    creditCode: { type: String, required: true },
    status: { type: String, enum: ["pending", "active", "completed"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

export const AdCampaign = models.AdCampaign || model("AdCampaign", AdCampaignSchema);
