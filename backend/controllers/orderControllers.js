import { orderHtml } from "../html/orderHtml.js";
import { Orders } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { Users } from "../models/userModel.js";
import { ApiFeatures, pagination } from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { MeritMeter } from "../utils/meritMeter.js";
import { sendEmail } from "../utils/sendMail.js";
import { body, validationResult } from "express-validator";



export const placeNewOrder = catchAsync(async (req, res, next) => {

    const { order_items, shipping_info } = req.body;

    for (const order of order_items) {

        const product = await Product.findById(order.product);
        if (!product) {
            return next(new ErrorHandler("Product not found!", 404));
        }

        if (product.stock < order.quantity) {
            if (product.stock === 0) {
                return next(new ErrorHandler(`Sorry for the inconvinience, but the product has just become out of stock: ${product.name}`, 404));
            }
            return next(new ErrorHandler(`Sorry for the inconvinience, but we only have ${product.stock} items of product: ${product.name}`, 400))
        }

        if(product.seller_id.toString() === req.user._id.toString()){
            return next(new ErrorHandler("You cannot order your own product!", 400))
        }

    }

    // Having 2 loops combined is not a good idea, since all the products in the cart should be ordered at once.
    for (const order of order_items) {
        const product = await Product.findById(order.product);

        product.stock -= order.quantity;
        await product.save({ validateBeforeSave: false });

        order.seller = product.seller_id;
        order.name = product.name;
        order.price = product.price;
        // order.image = product.images[0].image_url;
        order.discount_price = product.discount_percent || 0;
        order.final_price = product.final_price;

        const meritMeter = new MeritMeter(order.quantity, product.seller_id);
        meritMeter.addMerit();
    }

    const order = await Orders.create({ user: req.user._id, order_items, paid_at: new Date(Date.now()), shipping_info });

    let totalItemsPrice = 0;
    let taxPrice = 0;
    let shippingCost = 0;
    let totalPrice = 0;

    order.order_items.forEach((order) => {
        return totalItemsPrice += (order.price * order.quantity) - (order.discount_price * order.quantity);
    })

    taxPrice = totalItemsPrice * 18 / 100;
    totalPrice = totalItemsPrice + taxPrice;
    shippingCost = (totalPrice > 500) ? 0 : 100;
    totalPrice += shippingCost;

    order.tax_price = Math.round(taxPrice);
    order.items_price = Math.round(totalItemsPrice);
    order.shipping_cost = shippingCost;
    order.total_price = Math.round(totalPrice);

    await order.save({ validateBeforeSave: false });

    const trackOrderURL = `${req.protocol}://${req.get("host")}/`

    const html = orderHtml({
        head: "Order Confirmation",
        user_name: req.user.name,
        head_caption: "Your order has been successfully placed. Below are the details of your order:",
        order,
        order_caption: "Thank you for choosing ManyIN! We will process your order as soon as possible.",
        button_url: trackOrderURL,
        button_text: "Track Your Order",
        mail_caption: "If you have any queries or need further assistance, please don't hesitate to reply to this Mail."
    });

    sendEmail({
        email: req.user.email,
        subject: "Order Placed Successfully!",
        html
    })

    return res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        order
    })

});



export const getOrderDetails = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const order = await Orders.findById(id);
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    if (order.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You are not allowed to visit this URL!", 403));
    }

    return res.json({
        success: true,
        order
    })
})



export const getMyOrders = catchAsync(async (req, res, next) => {

    const apiFeatures = new ApiFeatures(Orders.find({}), req.query).searchOrders().filterOrders();
    const orders = await apiFeatures.products;

    const ordersCount = orders.length;
    
    const paginatedOrders = pagination(orders, 6, req.query.page);

    return res.json({
        success: true,
        orders: paginatedOrders,
        ordersCount,
    })
})



export const deleteMyOrder = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const order = await Orders.findById(id);
    if (!order) {
        return next(new ErrorHandler("Order not found!", 404));
    }

    if (order.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You are not allowed to perform this action!", 403));
    }

    for (const item of order.order_items) {
        if (item.product_status === "Cancelled") {
            return next(new ErrorHandler(`This Order is already Cancelled!`, 400));
        }

        if (item.product_status !== "Processing") {
            return next(new ErrorHandler(`You cannot cancel your order, the product has already been ${order.order_status}!`, 403))
        }

        item.product_status = "Cancelled";
    }

    // order.deleteOne();

    await order.save({ validateBeforeSave: false });

    const html = orderHtml({
        head: "Order Cancellation Confirmation",
        user_name: req.user.name,
        head_caption: "We extremely regret to here that you have canceled your order. Below are the details of your cancelled order:",
        order,
        order_caption: "",
        button_url: "#",
        button_text: "Check Cancellation Status",
        mail_caption: "We apologize for any inconvenience we may have caused. If you have any questions or concerns, please don't hesitate to reply to this Mail."
    });

    sendEmail({
        email: req.user.email,
        subject: "Order Cancellation Confirmation",
        html
    })

    return res.json({
        success: true,
        message: "Successfully cancelled your order!",
        order
    })
})



export const getAllOrders = catchAsync(async (req, res, next) => {

    const { page } = req.query;

    const apiFeatures = new ApiFeatures(Orders.find({}), req.query).searchOrders().filterOrders();
    const orders = await apiFeatures.products;

    const ordersCount = orders.length;
    
    const paginatedOrders = pagination(orders, 6, page);

    return res.json({
        success: true,
        orders: paginatedOrders,
        orders_count: ordersCount,
    })
})



export const deleteAnyOrder = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const order = await Orders.findByIdAndDelete(id);
    if (!order) {
        return next(new ErrorHandler("Order not found!", 404));
    }

    return res.json({
        success: true,
        message: "Order deleted successfully!",
        order
    })
})



export const updateAnyOrderStatus = catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const { status } = req.body;

    const order = await Orders.findById(id);
    if (!order) {
        return next(new ErrorHandler("Order not found!", 404));
    }

    for (const item in order.order_items) {
        item.product_status = status;
    }

    order.save({ validateBeforeSave: false });

    return res.json({
        success: true,
        message: `Order status updated to ${status}`,
        order
    })
})



export const getMyProductsOrders = catchAsync(async (req, res, next) => {

    // Getting the orders including sellers id in them
    const orders = await Orders.find({ "order_items.seller": { $in: req.user._id } });

    // Showing seller his Product that are bought by different buyers, instead of revealing the other orders of buyers to the seller which are placed along with seller's Product.
    const orderDetails = orders.map(order => {
        const Product = order.order_items.filter(item => item.seller.toString() === req.user._id.toString());
        return {
            _id: order._id,
            user: order.user,
            shipping_info: order.shipping_info,
            product: Product,
        }
    });

    return res.json({
        success: true,
        orders: orderDetails
    })
})



export const cancelOrderOfMyProduct = [

    body("justification")
        .isLength({ min: 10, max: 300 })
        .withMessage("The Justification provided must contain atleast 10 characters and atmost 300 characters!"),

    catchAsync(async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorHandler(errors.array().map((err) => err.msg).join(","), 400))
        }

        const { order_id, product } = req.query;
        const { justification } = req.body;

        const order = await Orders.findById(order_id);
        if (!order) {
            return next(new ErrorHandler("Order not found!", 404));
        }

        const user = await Users.findById(order.user);
        if (!user) {
            return next(new ErrorHandler("User not found!", 404))
        }

        order.order_items = order.order_items.map(item => {
            if (item.product.toString() === product.toString()) {
                return item.product_status = "Cancelled";
            }
            return item;
        });

        let noOrders = true;
        let totalItemPrice = 0;

        for (const item of order.order_items) {
            if (item.product_status !== "Cancelled") {
                totalItemPrice += item.price * item.quantity;
                noOrders = false;
            }
        }

        let taxPrice = totalItemPrice * 18 / 100;

        order.tax_price = taxPrice;
        order.items_price = totalItemPrice;
        order.total_price = totalItemPrice + taxPrice + order.shipping_cost;

        await order.save({ validateBeforeSave: false });

        const meritMeter = new MeritMeter(1, req.user._id);
        meritMeter.reduceMerit()

        const html = orderHtml({
            head: "Order Cancelled!",
            user_name: req.user.name,
            head_caption: `We regret to inform you that your has been canceled by your seller, ${req.user.name}. Below are the details of your cancelled order:`,
            order: (noOrders) ? "" : order,
            order_caption: `<strong>Seller's Justification for this inconvinience:</strong> ${justification}`,
            button_url: "#",
            button_text: "Check Order Status",
            mail_caption: "We apologize for any inconvenience we may have caused. If you have any questions or concerns, please don't hesitate to reply to this Mail."
        });

        sendEmail({
            email: user.email,
            subject: "Order Cancelled:(",
            html
        });

        return res.json({
            success: true,
            message: `Successfully cancelled the order placed by ${user.name}!`
        })

    })
]



export const cancelAllOrderOfMyProduct = [

    body('justification')
        .isLength({ min: 10, max: 300 })
        .withMessage("The Justification provided must contain atleast 10 characters and atmost 300 characters!"),

    catchAsync(async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErrorHandler(errors.array().map((err) => err.msg).join(","), 400));
        }

        const { product } = req.params;
        const { justification } = req.body;

        const orders = await Orders.find({ "order_items.seller": { $eq: req.user._id }, "order_items.product": { $eq: product } });
        if (!orders) {
            return next(new ErrorHandler("No orders of this product are found!", 404));
        }

        for (const order of orders) {

            const user = await Users.findById(order.user);

            let noOrders = true;
            let totalItemsPrice = 0;
            order.order_items = order.order_items.map((item) => {
                if (item.product.toString() === product.toString()) {
                    item.product_status = 'Cancelled';
                    return item
                }
                noOrders = false
                totalItemsPrice += item.price
                return item
            })

            order.items_price = totalItemsPrice;
            order.tax_price = totalItemsPrice * 18 / 100;
            order.total_price = order.items_price + order.tax_price + order.shipping_cost;

            await order.save({ validateBeforeSave: false });

            const html = orderHtml({
                head: "Order Cancelled!",
                user_name: user.name,
                head_caption: `We regret to inform you that your order has been canceled by your seller, ${req.user.name}. Below are the details of your cancelled order:`,
                order: (noOrders) ? "" : order,
                order_caption: `<strong>Seller's Justification for this inconvinience:</strong> ${justification}`,
                button_url: "#",
                button_text: "Check Order Status",
                mail_caption: "We apologize for any inconvenience we may have caused. If you have any questions or concerns, please don't hesitate to reply to this Mail."
            });

            sendEmail({
                email: user.email,
                subject: "Order Cancelled:(",
                html
            })
        }

        const meritMeter = new MeritMeter(orders.length, req.user._id)
        meritMeter.reduceMerit();

        return res.json({
            success: true,
            message: `Successfully cancelled all the orders of your product!`,
            orders
        })
    })
]



export const updateMyProductOrderStatus = catchAsync(async (req, res, next) => {
    const { order_id, product } = req.query;
    const { status } = req.body;

    const order = await Orders.findById(order_id);
    if (!order) {
        return next(new ErrorHandler("Order not found!", 404));
    }

    order.order_items = order.order_items.map(item => {
        if (item.product.toString() === product.toString()) {
            item.product_status = status;
            return item;
        }
        return item;
    });

    order.save({ validateBeforeSave: false });

    return res.json({
        success: true,
        message: `Successfully updated the order status to ${status}`,
        order
    })
});