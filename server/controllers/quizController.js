import Quiz from "../models/Quiz.js"
import ai from "../utils/gemini.js"

export const generateQuizzes = async (req, res) => {
    try {
        const { topic, studyText } = req.body;
        if (!topic || !studyText) {
            return res.status(401).json({ message: 'Topic and Study text are required' })
        }

        const prompt = `
            You are an expert AI study assistant. 
            Analyze the following study material on the topic "${topic}":

            "${studyText}"

            Generate a 3-question multiple choice quiz based strictly on this content.
            Return ONLY a raw JSON object with NO markdown code blocks, NO extra text.
            The JSON structure MUST follow this exact schema:

            {
                "topic": "${topic}",
                "questions": [
                {
                    "questionText": "Question string here?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correctAnswer": "Exact string matching one of the options",
                    "explanation": "Brief explanation why this option is correct"
                }
                ]
            }`
            ;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-falsh',
            contents: prompt
        })

        let rawText = response.text.trim();

        // Clean markdown formatting if AI wrapped JSON inside ```json ... ```
        if (rawText.startsWith('```json')) {
            rawText = rawText.replace(/^```json/, '').replace(/```\$/, '').trim();
        } else if (rawText.startsWith('```')) {
            rawText = rawText.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const quizData = JSON.parse(rawText)

        const quiz = await Quiz.create({
            user: req.user._id,
            topic: quizData.topic || topic,
            questions: quizData.questions
        })

        return res.status(201).json({
            success: true,
            quiz
        })

    } catch (err) {
        console.error('Chat Controller Error:', error.message);
        return res.status(500).json({ message: 'Failed to process AI chat message', error: err.message });
    }
}

export const getUserQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ user: req.user._id }).sort({ updatedAt: -1 })

        return res.status(200).json({
            success: true,
            count: quizzes.length,
            quizzes
        })
    } catch (err) {
        return res.status(500).json({ message: 'Error Fetching Quizzes' })
    }
}