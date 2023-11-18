import { Users } from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";


export const isSeller = catchAsync( async(req, res, next) => {
    const { token } = req.cookies;
    if(!token){
        return next(new ErrorHandler("Pease login before accessing this URL", 400));
    }

    const userPayload = jwt.verify(token, process.env.JWT_SECRET);
    if(!userPayload){
        res.cookie("token", "", {
            httpOnly: true,
            maxAge: 0
        })
        return next(new ErrorHandler("Something went wrong! Please Login again.", 404));
    }

    const user = await Users.findById(userPayload._id).select("+is_seller +seller_merit");
    
    if(!user){
        return next(new ErrorHandler("User not found!", 404));
    }

    if(!user.is_seller){
        return next(new ErrorHandler("You must be a seller to access this URL", 403))
    }

    req.user = user;
    next()
})