import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const userMiddleware = async (req, res, next) => {
  try {
    const {token} = req.cookies;

    if(!token){
        throw new Error("Token is not present");
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);

    const {_id} = payload;

    if(!_id){
        throw new Error("invalid Token!");
    }

    const result = await UserModel.findById(_id);

    if(!result){
        throw new Error("User Does not Exist!");
    }

    const userId = _id;
    req.result = result;
    req.userId = userId;

    next();
  } catch (e) {
    console.log("Error", e);
    res.status(404).json({
      success: false,
      message: `Error: ${e}, Or Not a Valid User!`,
    });
  }
};


export default userMiddleware;