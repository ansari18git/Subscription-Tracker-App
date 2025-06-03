import mongoose from "mongoose";
import { DB_URL,NODE_ENV } from "../config/env.js";

if(!DB_URL) {
    throw new Error('Please define the MONGODB_URL environment variable inside .env.<development/production>.local');
}

const connectToDatabase = async () => {
    try{
        await mongoose.connect(DB_URL)
        console.log(`Connected to MongoDB in ${NODE_ENV} mode`);
    }catch(err){
        console.log("Error Connecting to Database:", err);

        process.exit(1);
    }
}

export default connectToDatabase;