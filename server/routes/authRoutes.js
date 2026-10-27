import express from 'express';
import passport from 'passport';
import generateToken from '../utils/generateToken.js';

const router = express.Router()

// Trigger Google OAuth login with GET /api/auth/google
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'], // this scope tells to google that what data our app is asking permissions to view
        session: false // this session tells to passport that e are not using traditional server-side cookies/sessions. We are using modern stateless JWT tokens
    })
);

// Google redirects back to this URL GET /api/auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
        session: false
    }),
    (req, res) => {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`)
    }
)

export default router