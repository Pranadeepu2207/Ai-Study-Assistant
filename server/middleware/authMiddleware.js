import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // - indicates exclude
            //__v indicates Mongoose version key, generally used to track document versions.

            //select('-__v') excludes internal Mongoose version keys
            req.user = await User.findById(decoded.id).select('-__v') // finding user in DB 

            //if user Not Found
            if (!req.user) {
                return res.status(401).json({ message: "User Not Found, authorization denied" })
            }
            next()
        }catch(err){
            console.error('JWT Verification Error:', error.message);
            return res.status(401).json({message: "Not Authorized, Invalid or Expired Token"})
        }
    }

    //if Token is not sent in the Headers
    if(!token){
        return res.status(401).json({message: "Not Authorized, No Token Recieved"})
    }
}