import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },
        options: [{
            type: String,
            required: true
        }],
        correctAnswer: {
            type: String,
            required: true
        },
        explanation: {
            type: String
        }
    }
)

const quizScchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        topic: {
            type: String,
            required: true
        },
        questions: [questionSchema],
        score: {
            type: Number,
            default: null
        }
    },
    {
        timestamps: true
    }
)

const Quiz = mongoose.model('Quiz', quizScchema)
export default Quiz