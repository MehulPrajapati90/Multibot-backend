import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {register, login,logout, updateData, me} from "../controllers/authenticate.js"

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout)
authRouter.post("/update", authMiddleware, updateData);
authRouter.get("/me", authMiddleware, me);

export default authRouter;