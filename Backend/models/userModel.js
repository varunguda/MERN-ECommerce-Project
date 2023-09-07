import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [3, "Name should have more than 4 characters"],
    },

    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },

    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },

    avatar: {
        public_id: {
            type: String
        },
        url: {
            type: String,
        }
    },

    address: [
        {
            flat: {
                type: String,
                required: true
            },
            area: {
                type: String,
                required: true
            },
            landmark: {
                type: String,
                required: true
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

    created_at: {
        type: Date,
        default: Date.now
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
