import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Task } from "@/lib/models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Helper to verify admin
async function verifyAdmin(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "admin") return null;
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const tasks = await Task.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ tasks });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const newTask = await Task.create(body);
        return NextResponse.json({ message: "Task created", task: newTask });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "Task ID required" }, { status: 400 });

        await Task.findByIdAndDelete(id);
        return NextResponse.json({ message: "Task deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
