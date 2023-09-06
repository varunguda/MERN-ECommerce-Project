import { Users } from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import { ErrorHandler } from "../utils/errorHandler.js";



// ADMIN FUNCTIONS
export const getAllSellersAndBuyers = catchAsync( async (req, res, next) => {

    const users = await Users.find({ is_admin: false });

    return res.json({
        success: true,
        users
    })

})



export const updateUserRole = catchAsync( async(req, res, next) => {
    const { id } = req.params;
    const { is_seller, is_admin } = req.body;
    
    let user = await Users.findById(id).select("+is_admin");
    if(!user){
        return next(new ErrorHandler("User not found!", 404));
    }

    if(user.is_admin){
        // An Admin can create another admin but cannot remove an Admin
        return next(new ErrorHandler("This action cannot be performed!", 403))
    }

    user.is_seller = is_seller;
    user.is_admin = is_admin;

    user.save();

    return res.json({
        success: true,
        message: "User Role updated successfully!"
    })
})
