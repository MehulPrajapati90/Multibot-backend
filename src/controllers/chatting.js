import { GoogleGenAI } from "@google/genai";
import { promptData } from "../utils/prompt.js";
import chatModel from "../models/chat.js";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDusberEiHxMHh6Js-n5ny12gX3xwb20TA",
});

async function main(input, behaviour, id, character) {

  const chatData = await chatModel.findOne({
    userId: id,
    behaviour: character,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: chatData.chatHistory,
    config: {
      systemInstruction: behaviour,
    },
  });

  return response.text;
}

export const getChat = async (req, res) => {
  try {
    const id = req.userId;
    const { behaviour } = req.query;

    const chatData = await chatModel.findOne({
      userId: id,
      behaviour: behaviour,
    });

    res.status(200).json({
      success: true,
      message: chatData,
    });

  } catch (e) {
    console.log("Error", e);
    res.status(404).json({
      success: false,
      message: `Error: ${e}`,
    });
  }
};


export const getAllChat = async (req, res) => {
  try {
    const id = req.userId;

    const chatData = await chatModel.find({
      userId: id,
    });

    res.status(200).json({
      success: true,
      message: chatData,
    });

  } catch (e) {
    console.log("Error", e);
    res.status(404).json({
      success: false,
      message: `Error: ${e}`,
    });
  }
};

export const continuouschat = async (req, res) => {
  try {
    const { chatMessage, behaviour } = req.body;
    const id = req.userId;

    // Validate behaviour exists
    const behaviourInfo = promptData.find(item => item.character === behaviour);
    // console.log(behaviourInfo);
    if (!behaviourInfo) {
      return res.status(400).json({
        success: false,
        message: "We don't have such Behavioural Service!"
      });
    }

    // Find or create chat
    let chat = await chatModel.findOne({ userId: id, behaviour: behaviour });
    
    // If new chat, create with initial message
    if (!chat) {
      const initialResponse = behaviourInfo.message;
      chat = await chatModel.create({
        userId: id,
        behaviour,
        chatHistory: [{
          role: "model",
          parts: [{ text: initialResponse }],
          timestamp: new Date()
        }]
      });
      
      return res.status(200).json({
        success: true,
        message: initialResponse
      });
    }

    // For existing chat with message
    if (chatMessage) {
      // Add user message
      await chatModel.updateOne(
        { userId: id, behaviour },
        { $push: {
          chatHistory: {
            role: "user",
            parts: [{ text: chatMessage }],
            timestamp: new Date()
          }
        }}
      );

      // Get AI response
      const aiResponse = await main(chatMessage, behaviourInfo.details, id, behaviour);

      // Add AI response
      await chatModel.updateOne(
        { userId: id, behaviour },
        { $push: {
          chatHistory: {
            role: "model",
            parts: [{ text: aiResponse }],
            timestamp: new Date()
          }
        }}
      );

      return res.status(200).json({
        success: true,
        message: aiResponse
      });
    }

    // If no chatMessage but chat exists
    return res.status(200).json({
      success: true,
      message: "Ready to chat"
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteChatWindow = async(req, res)=>{
  try {
    const id = req.userId;
    const {behaviour} = req.body;

    await chatModel.deleteOne({
      behaviour: behaviour,
      userId: id
    })

    res.status(200).json({
      success: true,
      message: "Deleted Successfully!"
    })
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({
      success: false,
      message: e
    });
  }
}






// export const continuouschat = async (req, res) => {
//   try {
//     const { chatMessage } = req.body;
//     const { behaviour } = req.body;
//     const id = req.userId;
//     let isBehaviour = false;
//     let behaviourDetails = "";
//     let response = "";
//     let responseIdx = "";

//     for (let i = 0; i < promptData.length; i++) {
//       if (promptData[i].character === behaviour) {
//         isBehaviour = true;
//         responseIdx = i;
//         behaviourDetails = promptData[i].details;
//       }
//     }

//     if (!isBehaviour) {
//       throw new Error("We don't have such Behavioural Service!");
//     }

//     const existed = await chatModel.findOne({
//       userId: id,
//       behaviour: behaviour,
//     });

//     if (!existed) {
//       response = promptData[responseIdx].message;
//       await chatModel.create({
//         userId: id,
//         behaviour: behaviour,
//         chatHistory: [
//           {
//             role: "model",
//             parts: [{ text: response }],
//             timestamp: new Date(),
//           },
//         ],
//       });
//     } else {
//       if (chatMessage) {
//         response = await main(chatMessage, behaviourDetails, id, behaviour);

//         await chatModel.updateOne(
//           { userId: id, behaviour: behaviour },
//           {
//             $push: {
//               chatHistory: {
//                 role: "user",
//                 parts: [{ text: chatMessage }],
//                 timestamp: new Date(),
//               },
//             },
//           },
//           { upsert: true }
//         );

//         await chatModel.updateOne(
//           { userId: id, behaviour: behaviour },
//           {
//             $push: {
//               chatHistory: {
//                 role: "model",
//                 parts: [{ text: response }],
//                 timestamp: new Date(),
//               },
//             },
//           },
//           { upsert: true }
//         );
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: response,
//     });
//   } catch (e) {
//     console.log("Error", e);
//     res.status(404).json({
//       success: false,
//       message: `Error: ${e}`,
//     });
//   }
// };






// export const chatting = async (req, res) => {
//   try {
//     const { question } = req.body;
//     const { behaviour } = req.body;
//     let isBehaviour = false;
//     let behaviourDetails = "";
//     let response = "";

//     for (let i = 0; i < promptData.length; i++) {
//       if (promptData[i].character === behaviour) {
//         isBehaviour = true;
//         behaviourDetails = promptData[i].details;
//       }
//     }
//     if (!isBehaviour) {
//       throw new Error("We don't have such Behavioural Service!");
//     } else {
//       response = await main(question, behaviourDetails);
//     }

//     res.send(response);
//   } catch (e) {
//     console.log("Error", e);
//     res.status(404).json({
//       success: false,
//       message: `Error: ${e}`,
//     });
//   }
// };

// export const initialchat = async (req, res) => {
//   try {
//     const { behaviour } = req.body;
//     console.log(behaviour);
//     const id = req.userId;
//     let postmessage = "";
//     for (let i = 0; i < behaviour.length; i++) {
//       if (promptData[i].character === behaviour) {
//         postmessage = promptData[i].message;
//       }
//     }

//     await chatModel.create({
//       userId: id,
//       chatHistory: [
//         {
//           role: "model",
//           parts: [{ text: postmessage }],
//         },
//       ],
//     });

//     res.status(200).json({
//       success: true,
//       message: postmessage,
//     });
//   } catch (e) {
//     console.log("Error", e);
//     res.status(404).json({
//       success: false,
//       message: `Error: ${e}`,
//     });
//   }
// };
