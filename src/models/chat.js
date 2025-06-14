import {model, Schema} from "mongoose";
import { string } from "zod";


const chatSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    behaviour:{
        type: String,
        default: 'general',
        trim: true
    },
    chatHistory: {
        type: [
            {
                role: {
                    type: String,
                    default: "user",
                    enum: ["user", "model"] // Assuming these are the possible roles
                },
                parts: [{
                    text: {
                        type: String,
                        default: "Hello! how can i help you?" // Default text when none is provided
                    }
                }],
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    }
})


const chatModel = model("chathistory", chatSchema);

export default chatModel;