import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import validate from "../utils/validate.js";
import userModel from "../models/user.js";
import chatModel from "../models/chat.js";
import { continuouschat } from "./chatting.js";

const register = async (req, res) => {
  try {
    validate(req.body);

    const { userName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);

    const userExist = await UserModel.findOne({ emailId });
    if (userExist) {
      throw new Error("User Already Exist, You should Login!");
    }

    const user = await UserModel.create(req.body);

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, userName: user.userName },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    await chatModel.create({
      userId: user._id,
      chatHistory: [
        {
          role: "model",
          parts: [
            {
              text: "Hello This General Chat, For Better Experience Switch to different options!",
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Registered Successfull!",
    });
  } catch (e) {
    console.log("Error", e);
    res.status(404).json({
      success: false,
      message: `Error: ${e}`,
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // console.log(req.body);

    if (!emailId || !password) {
      res.status(404).json({
        success: false,
        message: "InValid Credentials!",
      });
    }

    const user = await UserModel.findOne({ emailId });
    if (!user) {
      throw new Error("User Not Already Exist!");
    }

    const matchPass = await bcrypt.compare(password, user.password);

    if (!matchPass) {
      throw new Error("InValid Credentials!");
    }

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, userName: user.userName },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      message: "User LoggedIn Successfully!",
    });
  } catch (e) {
    console.log("Error", e);
    res.status(404).json({
      success: false,
      message: `Error: ${e}`,
    });
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    res.cookie("token", null, { expires: new Date(Date.now()) });

    // res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (e) {
    console.log("Error", e);
    res.status(404).json({
      success: false,
      message: `Error: ${e}`,
    });
  }
};

const updateData = async (req, res) => {
  try {
    const data = req.body;
    const password = req.body.password;
    const userId = req.userId;

    if (password) {
      const user = await userModel.findById({ _id: userId });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const hashpass = await bcrypt.hash(password, 10);
        data.password = hashpass;
        await UserModel.updateOne({ _id: userId }, data);
      } else {
        await UserModel.updateOne({ _id: userId }, data);
      }
    } else {
      await UserModel.updateOne({ _id: userId }, data);
    }

    res.status(200).json({
      success: true,
      message: "Credential's updated",
    });
  } catch (e) {
    console.log("Error", e);
    res.status(404).json({
      success: false,
      message: `Error: ${e}`,
    });
  }
};

export const me = async (req, res) => {
  try {
    const result = req.result;

    res.status(200).json({
      success: true,
      user: result
    })
  } catch (e) {
    console.log("Error", e);
    res.status(404).json({
      success: false,
      message: `Error: ${e}`,
    });
  }
};

export { register, login, logout, updateData};
