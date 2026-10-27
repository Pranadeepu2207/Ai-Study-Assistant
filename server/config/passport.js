import dotenv from 'dotenv'
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js"

dotenv.config()

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {

            try {
                let user = await User.findOne({ googleId: profile.id }); //Looking for an existing user in MongoDB with this Google ID

                if (user) { // if user already exits pass the user document to Passport
                    return done(null, user)
                }

                //if the user doesn't exist create a new User document
                user = await User.create({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0]?.value
                })

                return done(null, user)
            } catch (err) {
                return done(err, null)
            }
        }
    )
)

export default passport;