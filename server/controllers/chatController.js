import Chat from "../models/Chat.js"
import ai from "../utils/gemini.js"

export const sendMessage = async (req, res) => {
    try {
        const { chatId, message } = req.body

        if (!message || message.trim() == '') {
            return res.status(401).json({ message: "Message text is Required" })
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message
        })

        const aiResponseText = response.text

        let chat;

        if (chatId) {
            chat = await Chat.findOne({ _id: chatId, user: req.user._id })

            if (!chat) {
                res.status(401).json({ message: "Chat session not found" })
            }

            chat.messages.push({ sender: 'user', text: message })
            chat.messages.push({ sender: 'ai', text: aiResponseText })
            await chat.save()
        } else {
            const titleSnippet = message.length > 30 ? `${message.substring(0, 30)}...` : message

            chat = await Chat.create({
                user: req.user._id,
                title: titleSnippet,
                messages: [
                    { sender: 'user', text: message },
                    { sender: 'ai', text: aiResponseText }
                ],
            })
        }

        return res.status(200).json({
            success: true,
            chatId: chat._id,
            aiResponse: aiResponseText,
            chat
        })


    } catch (err) {
        console.error('Chat Controller Error:', error.message);
        return res.status(500).json({ message: 'Failed to process AI chat message', error: err.message })
    }
}

export const getUserChats = async (req, res) => {
    try {
        const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 })

        return res.status(200).json({
            success: true,
            count: chats.length,
            chats
        })
    } catch (err) {
        return res.status(500).json({ message: 'Error Fetching Chat History' })
    }
} 