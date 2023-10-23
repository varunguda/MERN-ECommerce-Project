import Stripe from "stripe";
import { Orders } from "../models/orderModel.js";

export const validateStripePayment = async (user, stripe_payment_id) => {

    const stripe = new Stripe(process.env.STRIPE_KEY);

    const paymentIntent = await stripe.paymentIntents.retrieve(stripe_payment_id);

    if (paymentIntent.metadata.user.toString() !== user.toString()) {
        return false;
    }

    if (paymentIntent.status !== 'succeeded') {
        return false;
    }

    const exist = (await Orders.find({})).filter(order => order.payment_id === stripe_payment_id);
    if (exist.length > 0) {
        return false;
    }

    return paymentIntent.id;

}