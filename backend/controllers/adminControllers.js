import { body } from "express-validator";
import { Users } from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { pagination } from "../utils/apiFeatures.js";
import { Product } from "../models/productModel.js";
import { Orders } from "../models/orderModel.js";
import { DeletedUsers } from "../models/deletedUserModel.js";
import { userRoleValidator } from "../validators/adminValidators.js";
import { validationError } from "../validators/validationError.js";


const productCategories = [
    "Mobile Phone",
    "Laptop",
    "Monitor",
    "Clothing",
    "Shoes",
    "Watches",
    "Telivision",
    "Refrigerator",
    "Washing Machines",
    "Accessories",
    "Audio devices",
    "Beauty & Health",
];


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



export const updateUserRole = [

    ...userRoleValidator,

    catchAsync(async (req, res, next) => {

        validationError(req);

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
];



export const deleteAnyUser = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const user = await Users.findById(id).select("+is_admin");
    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }

    if (user.is_admin) {
        return next(new ErrorHandler("You are not permitted to perform this action!", 403));
    }

    await user.deleteOne();

    return res.json({
        success: true,
        message: `${user.name} account has been permanently removed!`
    });
})



export const setSellerMerit = [

    body("merit")
        .isNumeric().withMessage("Invalid Merit format!")
        .bail()
        .isFloat({ min: 0, max: 100 }).withMessage('Merit must be a number in between the range of 0 and 100'),

    body("sales")
        .isNumeric().withMessage("Invalid Sales format!"),

    catchAsync(async (req, res, next) => {

        validationError(req);

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

        await user.save({ validateBeforeSave: false });

        return res.json({
            success: true,
            message: "Seller's merit has been updated!",
        });
    })
];



export const dataAnalysis = catchAsync(async (req, res) => {

    // const products = await Product.find({});
    // const totalProductsCount = await Product.countDocuments();
    // const orders = await Orders.find({});
    // const totalOrdersCount = await Orders.countDocuments();
    // const users = await Users.find({});
    // const totalUsersCount = await Users.countDocuments();
    // const deletedUsers = await DeletedUsers.find({});

    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 5, currentDate.getMinutes() + 30);

    let sevenDaysAgo = new Date(currentDate.getTime());
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
        products,
        totalProductsCount,
        orders,
        totalOrdersCount,
        users,
        totalUsersCount,
        totalCustomers,
        totalSellers,
        totalDeletedUsers
    ] = await Promise.all([
        Product.find({}),
        Product.countDocuments(),
        Orders.find({ created_at: { $gte: sevenDaysAgo, $lte: currentDate } }),
        Orders.countDocuments(),
        Users.find({ created_at: { $gte: sevenDaysAgo, $lte: currentDate } }).select("+is_seller"),
        Users.countDocuments({ is_admin: false }),
        Users.countDocuments({ is_seller: false, is_admin: false }),
        Users.countDocuments({ is_seller: true, is_admin: false }),
        DeletedUsers.countDocuments()
    ]);


    let productCategoryAnalysis = {};
    productCategories.forEach((category) => {
        productCategoryAnalysis[category] = {
            in_stock: 0,
            out_of_stock: 0,
        }
    });

    products.forEach((product) => {
        if (product.stock > 0) {
            productCategoryAnalysis[product.category].in_stock += 1;
        } else {
            productCategoryAnalysis[product.category].out_of_stock += 1;
        }
    });


    let totalIncomeGenerated = {
        "Sunday": 0,
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0
    };
    let totalOrdersPlaced = {
        "Sunday": 0,
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0
    };
    let totalOrdersCancelled = {
        "Sunday": 0,
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0
    };
    let totalUsersRegistered = {
        "Sunday": 0,
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0
    };
    let totalSellersRegistered = {
        "Sunday": 0,
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0
    };

    let daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let currentDayIndex = new Date().getDay();

    const rearrangeObject = (obj, currentDayIndex) => {
        let rearrangedObj = {};
        let keys = Object.keys(obj);
        for (let i = 0; i < 7; i++) {
            let index = (currentDayIndex - i + 7) % 7;
            let key = keys[index];
            rearrangedObj[key] = obj[key];
        }

        let reversedObj = {};
        keys = Object.keys(rearrangedObj).reverse();
        for (const key of keys) {
            reversedObj[key] = rearrangedObj[key]
        }

        return reversedObj;
    }

    totalIncomeGenerated = rearrangeObject(totalIncomeGenerated, currentDayIndex);
    totalOrdersPlaced = rearrangeObject(totalOrdersPlaced, currentDayIndex);
    totalOrdersCancelled = rearrangeObject(totalOrdersCancelled, currentDayIndex);
    totalUsersRegistered = rearrangeObject(totalUsersRegistered, currentDayIndex);
    totalSellersRegistered = rearrangeObject(totalSellersRegistered, currentDayIndex);

    let last7Days = [];
    for (let i = 0; i < 7; i++) {
        let d = new Date(currentDate);
        d.setDate(d.getDate() - i);
        last7Days.push(d.toISOString().split("T")[0]);
    }

    last7Days.forEach((day) => {

        orders.forEach((order) => {
            let orderDate = new Date(order.paid_at);
            orderDate.setHours(orderDate.getHours() + 5);
            orderDate.setMinutes(orderDate.getMinutes() + 30);

            if (orderDate.toISOString().split('T')[0] === day) {
                totalOrdersPlaced[daysInWeek[orderDate.getUTCDay()]] += 1;
            }
            if (orderDate.toISOString().split('T')[0] === day && !order.order_items.every(item => item.product_status === "Cancelled")) {
                totalIncomeGenerated[daysInWeek[orderDate.getUTCDay()]] += order.total_price;
            }
            if (orderDate.toISOString().split('T')[0] === day && order.order_items.every(item => item.product_status === "Cancelled")) {
                totalOrdersCancelled[daysInWeek[orderDate.getUTCDay()]] += 1;
            }
        });

        users.forEach((user) => {
            let registeredDate = new Date(user.created_at);
            registeredDate.setHours(registeredDate.getHours() + 5);
            registeredDate.setMinutes(registeredDate.getMinutes() + 30);

            if (registeredDate.toISOString().split('T')[0] === day) {
                totalUsersRegistered[daysInWeek[registeredDate.getUTCDay()]] += 1;
                if (user.is_seller === true) {
                    totalSellersRegistered[daysInWeek[registeredDate.getUTCDay()]] += 1;
                }
            }
        });
    });


    return res.json({
        success: true,
        analysis: {
            total_products_count: totalProductsCount,
            total_orders_count: totalOrdersCount,
            total_users_count: totalUsersCount,
            total_deleted_users_count: totalDeletedUsers,
            total_sellers: totalSellers,
            total_customers: totalCustomers,
            income_generated: totalIncomeGenerated,
            orders_placed: totalOrdersPlaced,
            orders_cancelled: totalOrdersCancelled,
            users_registered: totalUsersRegistered,
            sellers_registered: totalSellersRegistered,
            products_analysis: productCategoryAnalysis
        }
    })
});
