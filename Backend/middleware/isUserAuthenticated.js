import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/errorHandler.js";
import { Users } from "../models/userModel.js";


export const isUserAuthenticated = async(req, res, next) => {
    const { token } = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please login before accessing this url", 400));
    }

    const userPayload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findById(userPayload._id);

    if(!user){
        return next(new ErrorHandler("Something went wrong, Please Login again!", 400));
    }

    req.user = user;

    next();

}