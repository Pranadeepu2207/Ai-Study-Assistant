import express from 'express'
import { generateQuizzes, getUserQuizzes } from '../controllers/quizController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.post("/", protect, generateQuizzes)
router.get("/", protect, getUserQuizzes)

export default router