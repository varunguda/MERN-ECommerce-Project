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

    created_at: {
        type: Date,
        default: Date.now
    },

    expires_at: {
        type: Date,
        default: Date.now,
        expires: 10 * 24 * 60 * 60  // 10 days
    }
})


export const DeletedUsers = mongoose.model("DeletedUsers", schema);
