import { orderHtml } from "../html/orderHtml.js";
import { Orders } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { Users } from "../models/userModel.js";
import { ApiFeatures, pagination } from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { MeritMeter } from "../utils/meritMeter.js";
import { sendEmail } from "../utils/sendMail.js";
import { validateStripePayment } from "../utils/validateStripePayment.js";
import { justificationValidator, statusValidator } from "../validators/orderValidators.js";
import { validationError } from "../validators/validationError.js";



export const placeNewOrder = catchAsync(async (req, res, next) => {

    const { order_items, address } = req.body;

    for (const order of order_items) {
        const product = await Product.findById(order.product);
        if (!product) {
            return next(new ErrorHandler("Product not found!", 404));
        }

        if (product.stock < order.quantity) {
            if (product.stock === 0) {
                return next(new ErrorHandler(`Sorry for the inconvinience, but this product has just become out of stock: ${product.name}`, 404));
            }
            return next(new ErrorHandler(`Sorry for the inconvinience, but we only have ${product.stock} items of product: ${product.name}`, 400))
        }

        if (product.seller_id.toString() === req.user._id.toString()) {
            return next(new ErrorHandler("You cannot order your own product!", 400));
        }
    }

    // Having 2 loops combined is not a good idea, since all the products in the cart should be ordered at once.
    for (const order of order_items) {
        const product = await Product.findById(order.product);

        product.stock -= order.quantity;
        await product.save({ validateBeforeSave: false });

        order.seller = product.seller_id;
        order.name = product.name;
        order.brand = product.brand;
        order.price = product.price;
        order.image = product.images[0].image_url;
        order.discount_price = product.discount_percent || 0;
        order.final_price = product.final_price;

        const meritMeter = new MeritMeter(order.quantity, product.seller_id);
        meritMeter.addMerit();
    }

    let paidId = false;

    if (req.body.stripe_payment_id) {
        paidId = await validateStripePayment(req.user._id, req.body.stripe_payment_id);
    }
    else {
        return next(new ErrorHandler("Seems like you haven't paid for your order. Please pay the amount before placing an order.", 403));
    }

    if (!paidId) {
        return next(new ErrorHandler("Invalid payment details, please contact ManyIN customer service incase amount has been debited from your account.", 403));
    }

    const order = await Orders.create({
        user: req.user._id,
        order_items,
        paid_at: new Date(Date.now()),
        delivery_address: address,
        payment_id: paidId,
    });


    let totalItemsPrice = 0;
    let taxPrice = 0;
    let shippingCost = 0;
    let totalPrice = 0;

    order.order_items.forEach((order) => {
        return totalItemsPrice += (order.final_price * order.quantity);
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

    const trackOrderURL = `${req.get('Referer')}/profile/orders`;

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
    });

    return res.status(201).json({
        success: true,
        message: "Order placed successfully!"
    });
});



export const getOrderPriceDetails = catchAsync(async (req, res, next) => {

    const { order_items } = req.body;

    let totalSavings = 0;
    let totalItemsPrice = 0;
    let totalItemsFinalPrice = 0;
    let taxPrice = 0;
    let shippingCost = 0;
    let finalOrderPrice = 0;

    for (const item of order_items) {

        const product = await Product.findById(item.product);
        if (!product) {
            return next(new ErrorHandler("Product not found!", 404));
        }

        totalItemsPrice += (product.price * item.quantity);
        totalItemsFinalPrice += (product.final_price * item.quantity);
        totalSavings += (product.price - product.final_price) * item.quantity;
    }

    taxPrice = totalItemsFinalPrice * 18 / 100;
    finalOrderPrice = totalItemsFinalPrice + taxPrice;
    shippingCost = (finalOrderPrice > 500) ? 0 : 100;
    finalOrderPrice += shippingCost;

    return res.json({
        success: true,
        taxPrice: Math.round(taxPrice),
        shippingCost,
        totalItemsFinalPrice: Math.round(totalItemsFinalPrice),
        totalItemsPrice: Math.round(totalItemsPrice),
        totalSavings: Math.round(totalSavings),
        finalOrderPrice: Math.round(finalOrderPrice),
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
});



export const getMyOrders = catchAsync(async (req, res, next) => {

    const totalOrdersCount = await Orders.find({ user: req.user._id }).countDocuments();
    const apiFeatures = new ApiFeatures(Orders.find({ user: req.user._id }), req.query).searchOrders().filterOrders().sortByCreate();
    const orders = await apiFeatures.items;

    const ordersCount = orders.length;

    let updatedOrders = pagination(orders, 6, req.query.page);

    return res.json({
        success: true,
        orders: updatedOrders,
        ordersCount,
        totalOrdersCount,
    })
});



export const cancelMyOrder = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const order = await Orders.findById(id);
    if (!order) {
        return next(new ErrorHandler("Order not found!", 404));
    }

    if (order.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You are not allowed to perform this action!", 403));
    }

    if (order.order_items.every(item => item.product_status === "Cancelled")) {
        return next(new ErrorHandler(`This Order has already been cancelled!`, 400));
    }

    if (order.order_items.every(item => item.product_status !== "Processing")) {
        return next(new ErrorHandler(`You cannot cancel this order, you can cancel the order only when all the products in your order are processing!`, 403));
    }

    for (const item of order.order_items) {
        item.product_status = "Cancelled";
    }

    // await order.deleteOne();

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

    const totalOrdersCount = await Orders.find({}).countDocuments();
    const apiFeatures = new ApiFeatures(Orders.find({}), req.query).searchOrders().filterOrders().sortByCreate();
    const orders = await apiFeatures.items;

    const ordersCount = orders.length;

    let updatedOrders = pagination(orders, 6, req.query.page);

    return res.json({
        success: true,
        orders: updatedOrders,
        ordersCount,
        totalOrdersCount,
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



export const updateAnyOrderStatus = [

    ...statusValidator,

    catchAsync(async (req, res, next) => {

        validationError(req);

        const { order_id, product_id } = req.query;
        const { status } = req.body;

        const order = await Orders.findById(order_id);
        if (!order) {
            return next(new ErrorHandler("Order not found!", 404));
        }

        for (const item of order.order_items) {
            if (item.product.toString() === product_id) {
                item.product_status = status;
            }
        }

        await order.save({ validateBeforeSave: false });

        return res.json({
            success: true,
            message: `Order status updated to '${status}'`,
        })
    })
];



export const getMyProductsOrders = catchAsync(async (req, res, next) => {

    const totalOrdersCount = await Orders.find({ "order_items.seller": { $in: req.user._id } }).countDocuments();
    const apiFeatures = new ApiFeatures(Orders.find({ "order_items.seller": { $in: req.user._id } }), req.query).searchOrders().filterOrders().sortByCreate();
    const orders = await apiFeatures.items;

    const ordersCount = orders.length;

    let updatedOrders = orders.map(order => {
        order.order_items = order.order_items.filter(item => item.seller.toString() === req.user._id.toString());
        return order;
    });

    updatedOrders = pagination(updatedOrders, 6, req.query.page);

    return res.json({
        success: true,
        orders: updatedOrders,
        ordersCount,
        totalOrdersCount,
    });
});



export const cancelOrderOfMyProduct = [

    ...justificationValidator,

    catchAsync(async (req, res, next) => {

        validationError(req);

        const { order_id } = req.query;
        const { justification } = req.body;

        const order = await Orders.findById(order_id);
        if (!order) {
            return next(new ErrorHandler("Order not found!", 404));
        }

        const user = await Users.findById(order.user);
        if (!user) {
            return next(new ErrorHandler("User not found!", 404))
        }

        if (order.order_items.every(item => (item.product_status === "Out for delivery" || item.product_status === "Delivered" || item.product_status === "Cancelled")
        )) {
            return next(new ErrorHandler("Order cannot be cancelled!"));
        }

        let cancelOrderCount = 0;
        order.order_items = order.order_items.map(item => {
            if ((item.seller.toString() === req.user._id.toString()) && (item.product_status !== "Out for delivery") && (item.product_status !== "Delivered") && (item.product_status !== "Cancelled")
            ) {
                item.product_status = "Cancelled";
                cancelOrderCount += 1;
            }
            return item;
        });

        let noOrders = true;
        let totalItemPrice = 0;

        for (const item of order.order_items) {
            if (item.product_status !== "Cancelled") {
                totalItemPrice += item.final_price * item.quantity;
                noOrders = false;
            }
        }

        let taxPrice = totalItemPrice * 18 / 100;

        order.tax_price = Math.round(taxPrice);
        order.items_price = Math.round(totalItemPrice);
        order.total_price = Math.round(totalItemPrice) + Math.round(taxPrice) + order.shipping_cost;

        await order.save({ validateBeforeSave: false });

        const meritMeter = new MeritMeter(cancelOrderCount, req.user._id);
        meritMeter.reduceMerit();

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
            message: `Successfully cancelled the order!`
        })

    })
];



export const cancelAllOrderOfMyProduct = [

    ...justificationValidator,

    catchAsync(async (req, res, next) => {

        validationError(req);

        const { product } = req.params;
        const { justification } = req.body;

        const orders = await Orders.find({ "order_items.seller": { $eq: req.user._id }, "order_items.product": { $eq: product } });
        if (!orders) {
            return next(new ErrorHandler("No orders of this product are found!", 404));
        }

        let totalCancelledOrders = 0;
        for (const order of orders) {
            const user = await Users.findById(order.user);

            let totalItemsPrice = 0;
            order.order_items = order.order_items.map((item) => {
                if ((item.product.toString() === product.toString()) && (item.product_status === "Processing")) {
                    item.product_status = 'Cancelled';
                    totalCancelledOrders += 1;
                    return item;
                }
                totalItemsPrice += item.price;
                return item;
            });

            order.items_price = totalItemsPrice;
            order.tax_price = totalItemsPrice * 18 / 100;
            order.total_price = order.items_price + order.tax_price + order.shipping_cost;

            if (totalCancelledOrders > 0) {
                await order.save({ validateBeforeSave: false });

                const html = orderHtml({
                    head: "Order Cancelled!",
                    user_name: user.name,
                    head_caption: `We regret to inform you that your order has been canceled by your seller, ${req.user.name}. Below are the details of your cancelled order:`,
                    order,
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
            }
        }

        if (!totalCancelledOrders) {
            return res.json({
                success: true,
                message: `Seems like there are no orders currently placed for this product.`,
            });
        }

        const meritMeter = new MeritMeter(totalCancelledOrders, req.user._id)
        meritMeter.reduceMerit();

        return res.json({
            success: true,
            message: `Successfully cancelled ${totalCancelledOrders} processing orders of your product!`,
        })
    })
];



export const updateMyProductOrderStatus = [

    ...statusValidator,

    catchAsync(async (req, res, next) => {

        validationError(req);

        const { order_id, product } = req.query;
        const { status } = req.body;

        const order = await Orders.findById(order_id);
        if (!order) {
            return next(new ErrorHandler("Order not found!", 404));
        }

        if (status === "Cancelled") {
            return next(new ErrorHandler("Can't cancel the order!", 400));
        }

        let error = false;
        order.order_items = order.order_items.map(item => {
            if (item.product.toString() === product.toString()) {
                if (item.product_status !== "Cancelled") {
                    item.product_status = status;
                }
                else {
                    error = true;
                }
                return item;
            }
            else {
                return item;
            }
        });

        if (error) {
            return next(new ErrorHandler("Cannot update order status since the order has been cancelled!"));
        }

        await order.save({ validateBeforeSave: false });

        return res.json({
            success: true,
            message: `Successfully updated the order status to ${status}`
        })
    })
];