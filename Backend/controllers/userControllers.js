import { DeletedUsers } from "../models/deletedUserModel.js";
import { Users } from "../models/userModel.js"
import { addCookie } from "../utils/addCookie.js";
import catchAsync from "../utils/catchAsync.js"
import { checkDeletedUsersCreate, checkDeletedUsersLogin } from "../utils/checkDeleted.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import {compareHashPassword, hashPassword} from '../utils/hashFunctions.js'


// ADMIN FUNCTIONS

export const getAllUsers = catchAsync( async (req, res, next) => {

    const users = await Users.find({});

    return res.json({
        success: true,
        users
    })

})



export const deleteAllUsers = catchAsync( async(req, res, next) => {
    await Users.deleteMany({});

    return res.json({
        success: true,
        message: "DELETED ALL THE USERS!"
    })
})






// USER FUNCTIONS

export const createUser = catchAsync( async (req, res, next) => {
    const { name, email, password } = req.body;
    let user = await Users.findOne({ email });
    if(user){
        return next(new ErrorHandler("This mail is already registered!", 400))
    }

    checkDeletedUsersCreate(req, res, next);
    
});


export const getUserDetails = catchAsync( async(req, res, next) => {
    return res.json({
        success:true,
        user: req.user
    })
})



export const loginUser = catchAsync( async(req, res, next) => {
    const { email, password } = req.body;

    const user = await Users.findOne({ email }).select("+password");

    if(!user){
        return await checkDeletedUsersLogin(req, res, next);
    }

    const isSame = await compareHashPassword(password, user.password);
    if(!isSame){
        return next(new ErrorHandler("Invalid Email or Password!", 400));
    }

    addCookie(user, `${user.name} loggedin successfully:)`, 200, req, res, next);
})



export const updateUserDetails = catchAsync( async(req, res, next) => {
    const { name, email, password, address, user_image_url, isSeller } = req.body;

    await Users.findByIdAndUpdate(req.user._id, { name, email, password, address, user_image_url, isSeller });

    return res.json({
        success: true,
        message: "User details updated successfully!"
    })

})



export const logoutUser = catchAsync( async(req, res, next) => {
    return res.cookie("token", "", {
        httpOnly: true,
        maxAge: 0,
    }).json({
        success: true,
        message: `${req.user.name} has been logged out successfully!`
    })
})



export const deleteUser = catchAsync( async(req, res, next) => {
    
    const user = await Users.findById(req.user._id).select("+password")
    const { name, email, password, isSeller, address, createdAt, user_image_url } = user;
    
    await DeletedUsers.create({ name, email, password, isSeller, address, createdAt, user_image_url, expireAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)});

    await Users.findByIdAndDelete(req.user._id);

    return res.json({
        success: true,
        message: "Successfully deleted your account, You can log back in again within the next 10 days!"
    })

})