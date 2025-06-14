import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./src/router/auhtRouter.js";
import chatRouter from "./src/router/chatRouter.js";
import connectDB from "./src/config/db.js";

import { promptData } from "./src/utils/prompt.js";
// console.log(promptData[7].details)
const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true, // Allow cookies/tokens
}));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chat", chatRouter);

const connection =async() => {
    await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server Running At http://localhost:${process.env.PORT}`);
  });
};

connection();
