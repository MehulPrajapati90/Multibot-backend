import express from "express"
import {continuouschat, getChat, getAllChat, deleteChatWindow} from "../controllers/chatting.js"
import userMiddleware from "../middleware/authMiddleware.js";

const chatRouter = express.Router();

chatRouter.post("/room/continue", userMiddleware, continuouschat);
chatRouter.get("/getchat", userMiddleware ,getChat);
chatRouter.get("/getallchat", userMiddleware ,getAllChat);
chatRouter.delete("/deletechat", userMiddleware, deleteChatWindow);

export default chatRouter;

