import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import catchAsync from "../utils/catchAsync.js";
import { Product } from "../models/productModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";


export const stripePayment = catchAsync( async(req, res, next) => {

    const { order_items } = req.body;
    const idempotencyKey = uuidv4();
    const stripe = new Stripe(process.env.STRIPE_KEY);

    let totalSavings = 0;
    let totalItemsPrice = 0;
    let totalItemsFinalPrice = 0;
    let taxPrice = 0;
    let shippingCost = 0;
    let finalOrderPrice = 0;
    let productNames = [];

    for (const item of order_items) {

        const product = await Product.findById(item.product);
        if (!product) {
            return next(new ErrorHandler("Product not found!", 404));
        }

        if(product.seller_id.toString() === req.user._id.toString()){
            return next( new ErrorHandler("You are not allowed to purchase your own product.", 400));
        }

        productNames.push(product.name);
        totalItemsPrice += (product.price * item.quantity);
        totalItemsFinalPrice += (product.final_price * item.quantity);
        totalSavings += (product.price - product.final_price) * item.quantity;
    }

    taxPrice = totalItemsFinalPrice * 18 / 100;
    finalOrderPrice = totalItemsFinalPrice + taxPrice;
    shippingCost = (finalOrderPrice > 500) ? 0 : 100;
    finalOrderPrice += shippingCost;

    const myPayment = await stripe.paymentIntents.create({
        amount: Math.round(finalOrderPrice)* 100,
        currency: "inr",
        metadata: {
            company: "ManyIN",
        },
    }, { idempotencyKey });

    return res.status(200).json({
        success: true, 
        client_secret: myPayment.client_secret,  
    })
})