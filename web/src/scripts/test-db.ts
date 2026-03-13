import { loadEnvConfig } from '@next/env';
import path from 'path';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

import mongoose from 'mongoose';

async function testConnection() {
    console.log("MONGODB_URI value is:", process.env.MONGODB_URI ? "Set (not showing for security)" : "NOT SET");
    console.log("URI from process.env:", process.env.MONGODB_URI);
    
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/refearn";
    
    try {
        console.log("Attempting to connect to:", uri.replace(/:([^:@]{3,})@/, ':***@'));
        await mongoose.connect(uri);
        console.log("Connected successfully!");
        console.log("Host:", mongoose.connection.host);
        console.log("Port:", mongoose.connection.port);
        console.log("Database:", mongoose.connection.name);
        await mongoose.disconnect();
    } catch (e) {
        console.error("Connection error:", e);
    }
}

testConnection();
