import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.DBURL)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        throw error;
    }
}