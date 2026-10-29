import express from 'express'
import { sendMessage, getUserChats } from '../controllers/chatController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, sendMessage)
router.get('/', protect, getUserChats)

export default router