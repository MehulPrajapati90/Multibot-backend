import {model, Schema} from "mongoose"


const userSchema = new Schema({
    userName:{
        type: String,
        trim:true,
        minLength: 1,
        maxLength: 30,
        required: true,
    },
    lastName:{
        type: String,
        trim:true,
    },
    emailId:{
        type: String,
        required:true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
    }
},{
    timestamps: true
})

const userModel = model("user", userSchema);
export default userModel;