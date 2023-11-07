import mongoose, { Schema } from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter your Name"],
        minLength: [3, "Name should have more than 4 characters"],
        maxLength: [30, "Name cannot exceed 30 characters"],
    },

    email: {
        type: String,
        required: [true, "Please enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid Email"],
    },

    password: {
        type: String,
        required: [true, "Please enter your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },

    avatar: {
        public_id: {
            type: String
        },
        url: {
            type: String,
        },
    },

    phone_number:{
        type: Number,
        length: 10,
        unique: true,
    },

    address: [
        {
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
            state_code: {
                type: String,
                required: true,
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
            },
            default_address:{
                type: Boolean,
                default: false,
                required: true,
            }
        }
    ],

    cart_items: [
        {
            product:{
                type: Schema.Types.ObjectId,
                ref: "Products",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            name:{
                type: String,
                required: true,
            }
        }
    ],

    is_seller: {
        type: Boolean,
        default: false,
        select: false,
    },

    is_admin: {
        type: Boolean,
        default: false,
        select: false,
    },

    seller_merit:{
        type: Number,
        default: undefined,
        max: 100,
    },

    total_sales:{
        type: Number,
        default: undefined,
    },

    created_at: {
        type: Date,
        default: Date.now,
    },

    reset_password_token: {
        type: String,
        select: false
    },
    
    reset_password_expire: {
        type: Date,
        select: false
    }
})


export const Users = mongoose.model("Users", schema);
