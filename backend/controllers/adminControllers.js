import { body } from "express-validator";
import { Users } from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { pagination } from "../utils/apiFeatures.js";



// ADMIN FUNCTIONS
export const getAllCustomers = catchAsync(async (req, res, next) => {

    const users = await Users.find({ is_admin: false, is_seller: false }).select("+is_seller +is_admin");
    const count = users.length;

    const paginatedUsers = pagination(users, 10, req.query.page);

    return res.json({
        success: true,
        users: paginatedUsers,
        totalUsersCount: count,
    })
})



export const getAllSellers = catchAsync(async (req, res, next) => {
    const users = await Users.find({ is_admin: false, is_seller: true }).select("+is_seller +is_admin");
    const count = users.length;

    const paginatedUsers = pagination(users, 10, req.query.page);

    return res.json({
        success: true,
        users: paginatedUsers,
        totalUsersCount: count,
    })
})



export const getAnyUserDetails = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await Users.findById(id);
    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }

    return res.json({
        success: true,
        user
    })
})



export const updateUserRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { is_seller, is_admin } = req.body;

    let user = await Users.findById(id).select("+is_admin");
    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }

    if (user.is_admin) {
        // An Admin can create another admin but cannot remove an Admin
        return next(new ErrorHandler("This action cannot be performed!", 403))
    }

    user.is_seller = is_seller;
    user.is_admin = is_admin;
    user.seller_merit = 80;
    user.total_sales = 0;

    await user.save({ validateBeforeSave: false });

    return res.json({
        success: true,
        message: "User Role updated successfully!"
    })
})



export const deleteAnyUser = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const user = await Users.findById(id).select("+is_admin");
    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }

    if (user.is_admin) {
        return next(new ErrorHandler("You are not permitted to perform this action!", 403))
    }

    await user.deleteOne();

    return res.json({
        success: true,
        message: `${user.name} account has been permanently removed!`
    });
})



export const setSellerMerit = [

    body("merit")
        .isNumeric()
        .withMessage("Invalid Merit format!")
        .isLength({ max: 3 }) //////////////////////////////////////////////////////////////////
        .withMessage('Price must be a number in between the range of 0 and 100'),

    body("sales")
        .isNumeric()
        .withMessage("Invalid Sales format!"),

    catchAsync(async (req, res, next) => {

        const { id } = req.params;

        const { merit, sales } = req.body;

        const user = await Users.findById(id).select("+is_seller");
        if (!user) {
            return next(new ErrorHandler("User not found!", 404));
        }
        if (!user.is_seller) {
            return next(new ErrorHandler(`${user.name} is not a seller!`, 400));
        }

        user.seller_merit = merit;
        user.total_sales = sales;
        user.save({ validateBeforeSave: false });

        return res.json({
            success: true,
            message: "Seller's merit has been updated!",
        })

    })
] 
