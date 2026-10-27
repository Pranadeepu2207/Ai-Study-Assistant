import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            enum: ['user', 'ai'], // it only allows 'user' or 'ai as values
            unique: true
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }
)

const chatSchema = new mongoose.Schema(
    {
        user:{
            type: String,
            ref: 'User', // Creates a Foreign key Link to the User Model
            required: true,
            index: true,
        },
        title: {
            type: String,
            default: 'NEW STUDY SESSION'
        },
        messages: [messageSchema] // Array of messages
    },
    {
        timestamps: true,
    }
)

const Chat = mongoose.model('Chat', chatSchema)
export default Chat