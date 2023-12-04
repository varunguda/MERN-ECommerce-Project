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
import { codeGenerator } from "../utils/generateCode.js";
import { Product } from "../models/productModel.js";
import { validationError } from "../validators/validationError.js";
import { addAddressValidator, emailValidator, nameValidator, passwordValidator, phoneNumberValidator, updateAddressValidator } from "../validators/userValidation.js";



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
    });
});



export const createUser = [

    nameValidator("name", 3, 40),
    ...emailValidator,
    passwordValidator("password"),

    catchAsync(async (req, res, next) => {

        validationError(req);

        const { email } = req.body;

        const user = await Users.findOne({ email });
        if (!!user) {
            return next(new ErrorHandler("This Mail is already registered!", 400));
        }

        const deletedUser = await DeletedUsers.findOne({ email }).select("+password");
        if (!!deletedUser) {
            return next(new ErrorHandler("This Mail is already registered!", 400));
        }

        verifyMail(req, res, next);
    })
];



export const createVerifiedUser = catchAsync(async (req, res, next) => {

    const { userCode } = req.body;

    if (!userCode) {
        return next(new ErrorHandler("Please provide the verification code!", 400));
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

    const hashPass = await hashPassword(password);

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
            phone_number: user.phone_number,
        }
    })
});



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



export const updateUserDetails = [

    nameValidator("name", 3, 40),
    ...emailValidator,

    catchAsync(async (req, res, next) => {

        validationError(req);

        const { name, email, avatar } = req.body;

        await Users.findByIdAndUpdate(req.user._id, { name, email, avatar },
            {
                new: true,
                runValidators: true,
            }
        );

        return res.json({
            success: true,
            message: "User details updated successfully!"
        });
    })
];



export const logoutUser = catchAsync(async (req, res, next) => {
    return res.cookie("token", "", {
        httpOnly: true,
        maxAge: 0,
        sameSite: process.env.NODE_ENV === "DEVELOPMENT" ? "lax" : "none",
        secure: process.env.NODE_ENV === "DEVELOPMENT" ? false : true,
    }).json({
        success: true,
        message: `${req.user.name} has been logged out successfully!`
    })
});



export const deleteUser = catchAsync(async (req, res, next) => {

    const user = await Users.findById(req.user._id).select("+password")
    const { name, email, password, mobile, created_at, avatar } = user;

    await DeletedUsers.create({ name, email, password, mobile, created_at, avatar, expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });

    await user.deleteOne();

    return res.cookie("token", "", {
        httpOnly: true,
        maxAge: 0,
    }).json({
        success: true,
        message: "Your account deletion has been completed successfully. You can still be able to log back in anytime within the next 30 days."
    });
});



export const forgotPassword = [

    ...emailValidator,

    catchAsync(async (req, res, next) => {

        validationError(req);

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
                subject: "Link to recover your ManyIN password!",
                html,
            });

            return res.json({
                success: true,
                message: `A password recovery mail has been sent to ${email}`
            })

        } catch (error) {
            user.reset_password_token = undefined;
            user.reset_password_expire = undefined;
            await user.save({ validateBeforeSave: false });

            return next(new ErrorHandler(error.message, 500))
        }
    })
];



export const recoverPassword = [

    passwordValidator("password"),
    passwordValidator("confirmPassword"),

    catchAsync(async (req, res, next) => {

        validationError(req);

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

        await user.save({ validateBeforeSave: false });

        // addCookie(user, `${user.name}'s password has been changed!`, 200, req, res, next);

        return res.json({
            success: true,
            message: `Your password has been successfully changed, Please login to continue!`
        })
    })
];



export const addUserAddress = [

    ...addAddressValidator,

    catchAsync(async (req, res, next) => {

        validationError(req);

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
            message: "Added your address successfully!",
        })
    })
];



export const getAllAddresses = catchAsync(async (req, res, next) => {
    return res.status(201).json({
        success: true,
        addresses: req.user.address,
    })
})



export const updateAddress = [

    ...updateAddressValidator,

    catchAsync(async (req, res, next) => {

        validationError(req);

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
            message: "Your address has been successfully updated!"
        });
    })
];



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



export const validateMobileNumber = [

    ...phoneNumberValidator,

    catchAsync(async (req, res, next) => {

        validationError(req);

        const { phone_num } = req.body;

        const otp = codeGenerator();
        const otp_expiry = Date.now() + 10 * 60 * 1000;

        if (req.session.otpDetails) {
            delete req.session.otpDetails;
        }

        req.session.otpDetails = {
            phone_num,
            otp,
            otp_expiry
        };

        const options = {
            authorization: process.env.FAST2SMS_API_KEY,
            route: "q",
            message: `
        Dear ${req.user.name},

        To verify your mobile number, please use the following One-Time Password (OTP):
        
        OTP: ${otp}
        
        Please enter this OTP on the verification page to confirm your mobile number. This OTP is valid for the next 10 minutes. If you did not request this OTP, please ignore this message.
        
        If you encounter any issues or have questions, please contact us at manyinindia@gmail.com
        
        Thank you for choosing us.
        
        Sincerely,
        ManyIN
        `,
            flash: "0"
        }

        const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${options.authorization}&route=${options.route}&message=${options.message}&flash=0&numbers=${phone_num}`);
        const data = await response.json();

        return res.json({
            success: true,
            data
        });
    })
];



export const verifyMobileNumberOtp = catchAsync(async (req, res, next) => {

    const { verification_otp } = req.body;

    if (!req.session.otpDetails) {
        return next(new ErrorHandler("Seems like something went wrong please request for an OTP again.", 404));
    }

    const { otp, otp_expiry, phone_num } = req.session.otpDetails;

    if (otp_expiry < Date.now()) {
        return next(new ErrorHandler("OTP has been expired.", 400));
    }

    if (otp !== verification_otp) {
        return next(new ErrorHandler("Wrong OTP! The OTP doesn't match", 400));
    }

    await Users.findByIdAndUpdate(req.user._id, { phone_number: phone_num });

    delete req.session.otpDetails;

    return res.json({
        success: true,
        message: "Mobile number has been added to your account successfully!"
    });
});



export const getWishlistProducts = catchAsync(async (req, res, next) => {

    let wishlistProducts = [];

    for (const item of req.user.wishlist_items) {
        const product = await Product.findById(item);
        if (product) {
            const { _id, rating, total_reviews, product_id, name, description, category, brand, stock, price, final_price, discount_percent, images } = product;

            wishlistProducts.push({
                _id, rating, total_reviews, product_id, name, description, category, brand, stock, price, final_price, discount_percent, images: images[0]
            });
        }
    }

    return res.json({
        success: true,
        list_products: wishlistProducts.reverse(),
    })
})



export const emptyWishlistProducts = catchAsync(async (req, res, next) => {

    await Users.findByIdAndUpdate(req.user._id, { wishlist_items: [] });

    return res.json({
        success: true,
        message: "Successfully removed all the products from your list."
    })
});