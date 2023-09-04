import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { Users } from "../models/userModel.js";


export const isAdminOrSeller = catchAsync( async(req, res, next) => {
    const { token } = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please login before accessing this URL", 400));
    }

    const userPayload = jwt.verify(token, process.env.JWT_SECRET);

    if(!userPayload){
        return next(new ErrorHandler("Something went wrong, Please Login again!", 500));
    }

    const user = await Users.findById(userPayload._id).select("+is_admin +is_seller");
    if(!user){
        return next(new ErrorHandler("User not found!", 404));
    }
    
    if(!user.is_admin && !user.is_seller){
        return next(new ErrorHandler("You are not allowed to perform this action!", 403))
    }

    req.user = user;

    next();
})