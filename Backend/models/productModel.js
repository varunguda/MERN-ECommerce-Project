import { Schema, model } from "mongoose";

const schema = new Schema({

    name: {
        type: String,
        required: [ true, "Please enter product Name" ]
    },
    description: {
        type: String,
        required: [ true, "Please enter product Description" ]
    },
    price: {
        type: Number,
        required: [ true, "Please enter product Price" ],
        maxLength: [ '8', "Price exceeded the limit!" ]
    },
    category: {
        type: String,
        required: [ true, "Please select a category" ]
    },
    rating: {
        type: Number,
        default: 0
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
            name:{
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            rating: {
                type: String,
                required: true
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
    createdAt: {
        type: Date,
        default: Date.now
    }

})



export const Products = model("Products", schema)