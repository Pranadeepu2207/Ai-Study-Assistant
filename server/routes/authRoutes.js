import express from 'express';
import passport from 'passport';
import { protect } from '../middleware/authMiddleware.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// Trigger Google OAuth login with GET /api/auth/google
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
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
        res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
    }
);

// Protected Route for getting user Profile through GET /api/auth/me
router.get(
    '/me', protect, (req, res) => {
        res.status(200).json({ success: true, user: req.user });
    }
);

export default router;
