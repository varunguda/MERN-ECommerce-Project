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

    avatar: {
        public_id: {
            type: String
        },
        url: {
            type: String,
        },
    },

    mobile:{
        type: Number,
        length: 10,
    },

    created_at: {
        type: Date,
        default: Date.now,
    },

    expires_at: {
        type: Date,
        default: Date.now,
        expires: 30 * 24 * 60 * 60  // 30 days
    }
})


export const DeletedUsers = mongoose.model("DeletedUsers", schema);
