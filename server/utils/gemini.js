import { GoogleGenAI } from "@google/genai";

//initializing google gen ai client with gemini api key, so that google can authenticates user requests
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

export default ai