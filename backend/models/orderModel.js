import { Schema, model } from "mongoose";


const schema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },

    order_items: [
        {
            name: {
                type: String,
                required: true
            },
            brand: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            final_price: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
            },
            quantity: {
                type: Number,
                required: true
            },
            discount_price: {
                type: Number,
                default: 0,
            },
            product: {
                type: Schema.Types.ObjectId,
                ref: "Products",
                required: true
            },
            seller:{
                type: Schema.Types.ObjectId,
                ref: "Users",
                required: true,
            },
            product_status: {
                type: String,
                required: true,
                default: "Processing",
                enum: [ "Processing", "Shipped", "In-transit" , "Out for delivery", "Delivered", "Cancelled" ],
            },
            ordered_at:{
                type: Date,
                default: () => {
            let now = new Date();
            now.setHours(now.getHours() + 5);
            now.setMinutes(now.getMinutes() + 30);
            return now;
        }
            }
        }
    ],

    delivery_address: {
        first_name:{
            type: String, 
            required: true,
        },
        last_name:{
            type: String, 
            required: true,
        },
        flat: {
            type: String,
            required: true
        },
        street_address: {
            type: String,
            required: true
        },
        landmark: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zip: {
            type: Number,
            required: true,
            length: [ 5, "Please enter a valid zip code!" ],
        },
        mobile:{
            type: Number,
            required: true,
        },
        delivery_notes: {
            type: String,
            maxlength: [ 250, "Delivery notes cannot exceed 250 characters" ]
        }
    },

    payment_id:{
        type: String,
        required: true,
    },

    coupon_discount: {
        type: Number,
        default: 0,
    },
    
    tax_price: {
        type: Number,
        required: true,
        default: 0,
    },

    items_price: {
        type: Number,
        required: true,
        default: 0,
    },

    shipping_cost: {
        type: Number,
        required: true,
        default: 0,
    },

    total_price: {
        type: Number,
        required: true,
        default: true
    },

    paid_at:{
        type: Date,
        required: true,
    },

    delivered_at: {
        type: Date,
    },

    created_at:{
        type: Date,
        default: () => {
            let now = new Date();
            now.setHours(now.getHours() + 5);
            now.setMinutes(now.getMinutes() + 30);
            return now;
        }
    },

});


export const Orders = model("Orders", schema);