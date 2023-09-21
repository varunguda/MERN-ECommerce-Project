import jwt from "jsonwebtoken";
import { Users } from "../models/userModel.js";

// Checks if a user is loggedIn, doesnt throw an error if not.
export const isLoggedIn = async(req, res, next) => {
    const { token } = req.cookies;
    if(!token){
        return next()
    }

    const userPayload = jwt.verify(token, process.env.JWT_SECRET);
    if(!userPayload){
        res.cookie("token", "", {
            httpOnly: true,
            maxAge: 0
        })
        return next();
    }

    const user = await Users.findById(userPayload._id);
    if(!user){
        return next();
    }

    req.user = user;

    next();
}