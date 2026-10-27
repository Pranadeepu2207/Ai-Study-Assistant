import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'
import connectDb from './config/db.js'
import './config/passport.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config() // load env variables from .env file

connectDb();

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())  // parses json payloads in request bodies

app.use(passport.initialize()) // Tell Express to use Passport

app.use('/api/auth', authRoutes) //All routes inside authRoutes will start with /api/auth

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'AI Study Assistant Server running successfully!' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// console.log(process.env.CLIENT_URL)
// console.log(process.env.PORT)