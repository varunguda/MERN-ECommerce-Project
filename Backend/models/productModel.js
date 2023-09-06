import { Schema, model } from "mongoose";

const schema = new Schema({

    seller_id: {
        type: Schema.Types.ObjectId,
        ref:"Users",
        required: true
    },

    name: {
        type: String,
        unique: true,
        required: [ true, "Please enter product Name" ],
        minLength: [ 5, "Product name must contain atleast 5 characters!" ],
        maxLength: [ 80, "Product name is too large!" ]
    },

    description: {
        type: String,
        required: [ true, "Please enter product Description" ],
        minLength: [ 5, "Product description must contain atleast 5 characters!" ],
        maxLength: [ 200, "Product description is too large!" ]
    },

    price: {
        type: Number,
        required: [ true, "Please enter product Price" ],
        maxLength: [ 8, "Price exceeded the limit!" ]
    },

    category: {
        type: String,
        required: [ true, "Please select a category" ],
    },

    rating: {
        type: Number,
        default: 0,
        maxLength: [ 5, "Rate the product in 0-5 star range" ]
    },

    images: [
        {
            pub_id: {
                type: String,
                required: true
            },
            image_url: {
                type: String,
                required: true
            }
        }
    ],

    stock: {
        type: Number,
        default: 1,
        maxLength: [ 4, "Stock cannot exceed 4 numbers"]
    },

    reviews: [
        {
            user_id: {
                type: Schema.Types.ObjectId,
                ref: "Users",
                required: true
            },
            isVerifiedPurchase: {
                type: Boolean,
                required: true
            },
            name:{
                type: String,
                required: true,
                maxLength: [ 10, "Review name is too large!" ]
            },
            title: {
                type: String,
                required: true,
                maxLength: [ 20, "Review Title is too large!" ]
            },
            comment: {
                type: String,
                required: true,
                maxLength: [ 400, "Review name is too large!" ]
            },
            rating: {
                type: Number,
                required: true,
                maxLength: [5, "Rate the product in 0-5 star range"]
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
            ]
        }
    ],

    total_reviews: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    }

})


export const Products = model("Products", schema)