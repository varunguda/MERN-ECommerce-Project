import { DeletedUsers } from "../models/deletedUserModel.js";
import { Users } from "../models/userModel.js";
import { addCookie } from "./addCookie.js";
import catchAsync from "./catchAsync.js";
import { ErrorHandler } from "./errorHandler.js";
import { compareHashPassword, hashPassword } from "./hashFunctions.js";


export const checkDeletedUsersLogin = catchAsync( async(req, res, next) => {

    const { email, password} = req.body;

    let user = await DeletedUsers.findOne({ email }).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password!", 400));
    }

    const isSame = await compareHashPassword(password, user.password);
    if(!isSame){
        return next(new ErrorHandler("Invalid Email or Password!", 400));
    }

    const { name, is_seller, address, created_at, user_image_url } = user;
    
    const hashPass = await hashPassword(password)
    
    user = await Users.create({ name, email, password: hashPass , is_seller, address, created_at, user_image_url});
    
    await DeletedUsers.findOneAndDelete({ email });
    
    addCookie(user, `${user.name}, Good to see you back again:)`, 200, req, res, next);

})
