import mongoose from 'mongoose';

async function testConnection() {
    const uri = "mongodb://admin:Thisis_admin1st1st@34.9.202.173:27017/paypulse?authSource=admin";
    try {
        console.log("Connecting...");
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected to MongoDB successfully!");
        mongoose.disconnect();
    } catch (e) {
        console.error("Connection failed:", e.message);
        process.exit(1);
    }
}

testConnection();
