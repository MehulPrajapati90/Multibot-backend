import mongoose from "mongoose";

const connectDB = async()=>{
    console.log("Connected to DB!");
    await mongoose.connect(process.env.CONNECT_STRING);
}

export default connectDB;