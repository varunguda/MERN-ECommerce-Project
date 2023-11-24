import { Schema, model } from "mongoose";


const ReviewSchema = new Schema({

    rating: {
        type: Number,
        default: 0,
        max: [5, "Rate the product in 0-5 star range"]
    },

    reviews:[
        {
            user_id: {
                type: Schema.Types.ObjectId,
                ref: "Users",
                required: true
            },
        
            is_verified_purchase: {
                type: Boolean,
                required: true
            },
        
            product_name: {
                type: String,
                required: true
            },
        
            name: {
                type: String,
                required: true,
            },
        
            title: {
                type: String,
                required: true,
                maxLength: [50, "Review title is too large!"]
            },
        
            comment: {
                type: String,
                required: true,
                maxLength: [600, "Review comment is too large!"]
            },
        
            rating: {
                type: Number,
                required: true,
                max: [5, "Rate the product in 1-5 star range"]
            },
        
            images: [
                {
                    pub_id: {
                        type: String,
                    },
                    image_url: {
                        type: String
                    }
                }
            ],
        
            likes: {
                type: Number,
                default: 0,
            },

            liked_users: [
                {
                    user_id:{
                        type: Schema.Types.ObjectId,
                        ref: "Users",
                    },
                },
            ],
            
            dislikes: {
                type: Number,
                default: 0,
            },

            disliked_users: [
                {
                    user_id:{
                        type: Schema.Types.ObjectId,
                        ref: "Users",
                    },
                },
            ],
        }
    ],

    total_reviews:{
        type: Number,
        required: true,
        default: 0,
    },

    created_at:{
        type: Date,
        default: Date.now,
        select: false,
        immutable: true,
    }
});



export const Review = model("Review", ReviewSchema);
