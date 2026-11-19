import mongoose from "mongoose";

let cachedConnection = null;

export const connectDB = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    try {
        const databaseName = process.env.MONGODB_DB || "converge";
        cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: databaseName,
        });
        console.log(`MongoDB connected to database: ${mongoose.connection.name}`);
        return cachedConnection;
    }
    catch(err){
        console.error("MongoDB connection error:",err.message);
        throw err;
    }
};