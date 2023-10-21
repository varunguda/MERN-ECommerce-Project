import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import catchAsync from '../utils/catchAsync';
import { Product } from '../models/productModel';
import { ErrorHandler } from '../utils/errorHandler';


export const stripePayment = catchAsync(async (req, res, next) => {

    const { order_items, token } = req.body;
    const idempotencyKey = uuidv4();
    const stripe = new Stripe('sk_test_51O3eZ4SCnAazxpoTtcGoq57znhnkT0vnUUCtMICJoWDqzKkCIEB0QLPpABWyUJB0sweNrZKtSEIRvdeMZLCK7ft300JsoYOYZd');

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

        productNames.push(product.name);
        totalItemsPrice += (product.price * item.quantity);
        totalItemsFinalPrice += (product.final_price * item.quantity);
        totalSavings += (product.price - product.final_price) * item.quantity;
    }

    taxPrice = totalItemsFinalPrice * 18 / 100;
    finalOrderPrice = totalItemsFinalPrice + taxPrice;
    shippingCost = (finalOrderPrice > 500) ? 0 : 100;
    finalOrderPrice += shippingCost;

    const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
    })

    if(!customer){
        return next(new ErrorHandler("Payment cannot be processed", 400));
    }

    const result = await stripe.charges.create({ 
        amount: finalOrderPrice,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchase of ${productNames.join(",")}`,
        
    }, { idempotencyKey });

    return res.status(200).json({
        result
    })

});