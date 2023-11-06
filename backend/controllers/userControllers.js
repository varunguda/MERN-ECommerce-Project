import { DeletedUsers } from "../models/deletedUserModel.js";
import { Users } from "../models/userModel.js"
import { addCookie } from "../utils/addCookie.js";
import catchAsync from "../utils/catchAsync.js"
import { checkDeletedUsersLogin } from "../utils/checkDeleted.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { compareHashPassword, hashPassword } from '../utils/hashFunctions.js';
import crypto from 'crypto';
import { sendEmail } from "../utils/sendMail.js";
import { verifyMail } from "../utils/verifyMail.js";



export const checkUser = catchAsync(async (req, res, next) => {

    const { email } = req.body;

    let exists = false;
    const user = await Users.findOne({ email });
    if (user) {
        exists = true;
    }

    if (!exists) {
        const deletedUser = await DeletedUsers.findOne({ email });
        if (deletedUser) {
            exists = true;
        }
    }

    return res.json({
        success: true,
        exists,
        email,
    })
})



export const createUser = catchAsync(async (req, res, next) => {

    const { email } = req.body;

    const user = await Users.findOne({ email });
    if (user) {
        return next(new ErrorHandler("This Mail is already registered!", 400))
    }

    const deletedUser = await DeletedUsers.findOne({ email }).select("+password");
    if (deletedUser) {
        return next(new ErrorHandler("This Mail is already registered!", 400));
    }

    verifyMail(req, res, next);

});



export const createVerifiedUser = catchAsync(async (req, res, next) => {

    const { userCode } = req.body;

    if (!userCode) {
        return next(new ErrorHandler("Invalid Input!", 400));
    }

    if (!req.session.registrationDetails) {
        return next(new ErrorHandler("Resource not found! Please try again!", 404))
    }

    const { name, email, password, avatar, code, codeExpireTime } = req.session.registrationDetails;

    // const emailPayload = jwt.verify(token, process.env.JWT_SECRET);
    // if(emailPayload.email !== email){
    //     return next(new ErrorHandler("Resource not found! Please try again.", 400))
    // }

    if (codeExpireTime < Date.now()) {
        return next(new ErrorHandler("Confirmation Code expired!", 400))
    }

    if (userCode !== code) {
        return next(new ErrorHandler("Invalid code! Please try again.", 400))
    }

    const hashPass = await hashPassword(password)

    const user = await Users.create({ name, email, password: hashPass, avatar });

    delete req.session.registrationDetails;

    addCookie(user, `Verification finished, Registered ${name} successfully!`, 201, req, res, next);

});



export const getUserDetails = catchAsync(async (req, res, next) => {

    const user = await Users.findById(req.user._id).select("+is_admin +is_seller");

    return res.json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            is_seller: user.is_seller,
            is_admin: user.is_admin,
            avatar: user.avatar,
        }
    })
})



export const loginUser = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    const user = await Users.findOne({ email }).select("+password +is_admin +is_seller");

    if (!user) {
        return await checkDeletedUsersLogin(req, res, next);
    }

    const isSame = await compareHashPassword(password, user.password);
    if (!isSame) {
        return next(new ErrorHandler("Invalid Email or Password!", 400));
    }

    addCookie(user, `${user.name} loggedin successfully:)`, 200, req, res, next);
})



export const updateUserDetails = catchAsync(async (req, res, next) => {
    const { name, email, address, avatar } = req.body;

    const user = await Users.findByIdAndUpdate(req.user._id, { name, email, address, avatar },
        {
            new: true,
            runValidators: true,
        });

    return res.json({
        success: true,
        message: "User details updated successfully!",
        user
    })

})



export const logoutUser = catchAsync(async (req, res, next) => {
    return res.cookie("token", "", {
        httpOnly: true,
        maxAge: 0,
    }).json({
        success: true,
        message: `${req.user.name} has been logged out successfully!`
    })
})



export const deleteUser = catchAsync(async (req, res, next) => {

    const user = await Users.findById(req.user._id).select("+password")
    const { name, email, password, address, created_at, user_image_url } = user;

    await DeletedUsers.create({ name, email, password, address, created_at, user_image_url, expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) });

    await user.deleteOne()

    return res.json({
        success: true,
        message: "Successfully deleted your account, You can log back in again within the next 10 days!"
    })

});



export const forgotPassword = catchAsync(async (req, res, next) => {

    const { email } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("Account doesn't exist", 400));
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.reset_password_token = resetPasswordToken;
    user.reset_password_expire = new Date(Date.now() + 15 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    const resetPasswordURL = `${req.protocol}://${req.headers["x-forwarded-host"]}/account/password/reset/${resetToken}`;

    const html = `<html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Montserrat', sans-serif;
          background-color: #f7f7f7;
          text-align: center;
          margin: 0;
          padding: 0;
        }
    
        .container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          max-width: 400px;
          margin: 0 auto;
          padding: 30px;
          text-align: left;
        }
    
        h1 {
          color: #007bff;
          font-size: 28px;
          margin-bottom: 20px;
        }
    
        p {
          color: #333;
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
    
        a.button {
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          display: inline-block;
          font-size: 20px;
          transition: background-color 0.3s ease;
        }
    
        a.button:hover {
          background-color: #0056b3;
        }
    
        .important {
          color: #d9534f;
          font-size: 18px;
          margin-top: 30px;
        }
    
        .note {
          color: #777;
          font-size: 14px;
          margin-top: 20px;
        }
      </style>
    </head>
    
    <body>
    
      <div class="container">
        <h1>Password Reset Request</h1>
    
        <p>It seems like you've requested to reset your password. To proceed, click on the link below:</p>
    
        <a href="${resetPasswordURL}" class="button">Reset Password</a>
    
        <p class="important"><strong>Important:</strong> If you haven't requested to reset your password, please ignore this email.</p>
    
        <p class="note">Note: Clicking on this URL could pose a security risk to your account if you didn't initiate the password reset.</p>
      </div>
    
    </body>
    
    </html>
    `

    try {

        await sendEmail({
            email,
            subject: "Link to recover your MANYin password!",
            html,
        });

        return res.json({
            success: true,
            message: `A password recovery mail has been sent to ${email}`
        })

    } catch (error) {
        user.reset_password_token = undefined;
        user.reset_password_expire = undefined;
        user.save()
        return next(new ErrorHandler(error.message, 500))
    }

});



export const recoverPassword = catchAsync(async (req, res, next) => {

    const { resetToken } = req.params;
    const { password, confirmPassword } = req.body;

    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await Users.findOne({ reset_password_token: resetPasswordToken, reset_password_expire: { $gt: Date.now() } }).select("+password+resetPasswordExpire+resetPasswordToken");

    if (!user) {
        return next(new ErrorHandler("Reset password link is invalid or has been expired!", 400))
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password doesn't match the confirm password!", 400))
    }

    user.password = await hashPassword(password);
    user.reset_password_token = undefined;
    user.reset_password_expire = undefined;

    await user.save();

    // addCookie(user, `${user.name}'s password has been changed!`, 200, req, res, next);

    return res.json({
        success: true,
        message: `Your password has been successfully changed! Please login to continue.`
    })

});



export const addUserAddress = catchAsync(async (req, res, next) => {

    const {
        first_name,
        last_name,
        flat,
        street_address,
        landmark,
        city,
        state,
        state_code,
        zip,
        mobile,
        delivery_notes,
        default_address,
    } = req.body;

    const user = await Users.findById(req.user._id);

    if (default_address === true) {
        user.address = user.address.map((address) => {
            if (address.default_address === true) {
                address.default_address = false;
            }

            return address;
        });
    }

    user.address.push({
        first_name,
        last_name,
        flat,
        street_address,
        landmark,
        city,
        state,
        state_code,
        zip,
        mobile,
        delivery_notes,
        default_address,
    });

    await user.save({ validateBeforeSave: false });

    return res.status(201).json({
        success: true,
        addresses: user.address,
        message: "Added your address successfully!",
    })
});



export const getAllAddresses = catchAsync(async (req, res, next) => {
    return res.status(201).json({
        success: true,
        addresses: req.user.address,
    })
})



export const updateAddress = catchAsync(async (req, res, next) => {

    const { addressId } = req.params;
    const {
        first_name,
        last_name,
        flat,
        street_address,
        landmark,
        city,
        state,
        state_code,
        zip,
        mobile,
        delivery_notes,
        default_address,
    } = req.body;

    const user = await Users.findById(req.user._id);

    if (!user.address.some((address) => address._id.toString() === addressId)) {
        return next(new ErrorHandler("Address doesn't exist", 404));
    }

    if (default_address === true) {
        user.address = user.address.map((address) => {
            if (address.default_address === true) {
                address.default_address = false;
            }
            return address;
        });
    }

    user.address = user.address.map((address) => {
        if (address._id.toString() === addressId) {
            return ({
                ...address,
                first_name,
                last_name,
                flat,
                street_address,
                landmark,
                city,
                state,
                state_code,
                zip,
                mobile,
                delivery_notes,
                default_address,
            })
        }
        else {
            return address
        }
    });

    await user.save({ validateBeforeSave: false });

    return res.json({
        success: true,
        message: "Your address was successfully updated!"
    });
});



export const deleteUserAddress = catchAsync(async (req, res, next) => {

    const { addressId } = req.params;

    const user = await Users.findById(req.user._id);

    if (!user.address.some((address) => address._id.toString() === addressId)) {
        return next(new ErrorHandler("Address doesn't exist", 404));
    }

    user.address = user.address.filter((address) => address._id.toString() !== addressId);

    await user.save({ validateBeforeSave: false });

    return res.json({
        success: true,
        message: "Your address was successfully removed!"
    });
})