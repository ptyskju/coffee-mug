import mongoose from "mongoose";

export async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/coffee-mug');
    console.log('MongoDB Connected');
}
