import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const databaseName = process.env.MONGODB_DB || "converge";
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: databaseName,
        });
        console.log(`MongoDB connected to database: ${mongoose.connection.name}`);
    }
    catch(err){
        console.error("MongoDB connection error:",err.message);
        process.exit(1);
    }
};
