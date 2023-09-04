import { DeletedUsers } from "../models/deletedUserModel.js";
import { Users } from "../models/userModel.js"
import { addCookie } from "../utils/addCookie.js";
import catchAsync from "../utils/catchAsync.js"
import { checkDeletedUsersAndCreate, checkDeletedUsersLogin } from "../utils/checkDeleted.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import {compareHashPassword } from '../utils/hashFunctions.js';
import crypto from 'crypto';
import { sendEmail } from "../utils/sendMail.js";


// USER FUNCTIONS

export const createUser = catchAsync( async (req, res, next) => {
    const { name, email, password } = req.body;
    let user = await Users.findOne({ email });
    if(user){
        return next(new ErrorHandler("This mail is already registered!", 400))
    }

    checkDeletedUsersAndCreate(req, res, next);
    
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
    const { name, email, address, user_image_url } = req.body;

    await Users.findByIdAndUpdate(req.user._id, { name, email, address, user_image_url });

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

});



export const forgotPassword = catchAsync( async(req, res, next) => {
    const { email } = req.body;

    const user = await Users.findOne({ email });
    if(!user){
        return next(new ErrorHandler("This mail has not yet been registered!", 400));
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await Users.findOneAndUpdate( {email} ,{ resetPasswordToken, resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000) })

    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`

    // const message = `URL to your password reset request: \n\n ${resetPasswordURL} \n\n !!! If you havent requested for resetting your password, Ignore the above link !!! \n NOTE: Clicking on this URL could be a possible threat to your account if you haven't requested to reset your password.`

    const html = `<html>
                    <body>
                        URL to your password reset request:<br/><br/> ${resetPasswordURL} <br/><br/>
                          
                        <p><span style="color: red;">!!! If you havent requested for resetting your password, Ignore the above link !!!</span></p><br/>
                        <p>NOTE: Clicking on this URL could be a possible threat to your account if you haven't requested to reset your password.</p>
                    </body>
                </html>`

    try {

        await sendEmail({
            email,
            subject: "Link to recover your MANYin password!",
            html
        })

        return res.json({
            success: true,
            message: `A password recovery mail has been sent to ${email}`
        })
        
    } catch (error) {
        await Users.findOneAndUpdate( {email} ,{ resetPasswordToken: undefined, resetPasswordExpire: undefined });
        return next(new ErrorHandler(error.message, 500))
    }


})