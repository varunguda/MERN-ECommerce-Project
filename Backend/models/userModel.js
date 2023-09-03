import mongoose from "mongoose";

const schema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, "Users name must be provided" ],
    },

    email: {
        type: String,
        required: [true, "Email must be provided"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "Password must be provided"],
        select: false
    },

    user_image_url:{
        type: String
    },

    address: [
        {
            flat_details: {
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
                required: true
            }
        }
    ],

    is_seller: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})


export const Users = mongoose.model("Users", schema);
