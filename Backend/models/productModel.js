import { Schema, model } from "mongoose";

const productCategories = [
    "Mobile Phone",
    "Laptop",
    "Computer",
    "Monitor",
    "Clothing",
    "Shoes",
    "Watches",
    "Telivision",
    "Refrigerator",
    "Computer Accessories",
    "Mobile Accessories",
    "Beauty & Health",
    "Headphones & Earphones"
]


const ProductSchema = new Schema({

    seller_id: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    name: {
        type: String,
        required: [true, "Please enter product Name"],
        minLength: [5, "Product name must contain atleast 5 characters!"],
        maxLength: [80, "Product name is too large!"]
    },

    description: {
        type: String,
        required: [true, "Please enter product Description"],
        minLength: [5, "Product description must contain atleast 5 characters!"],
        maxLength: [200, "Product description is too large!"]
    },

    category: {
        type: String,
        required: [true, "Please select a category"],
        enum: productCategories
    },

    brand: {
        type: String,
        required: true,
        maxLength: [80, "Product brand name is too large!"]
    },

    rating: {
        type: Number,
        default: 0,
        max: [5, "Rate the product in 0-5 star range"]
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
            name: {
                type: String,
                required: true,
                maxLength: [10, "Review name is too large!"]
            },
            title: {
                type: String,
                required: true,
                maxLength: [20, "Review Title is too large!"]
            },
            comment: {
                type: String,
                required: true,
                maxLength: [400, "Review name is too large!"]
            },
            rating: {
                type: Number,
                required: true,
                max: [5, "Rate the product in 0-5 star range"]
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
                select: false,
            },
            dislikes: {
                type: Number,
                default: 0,
                select: false,
            }
        }
    ],

    total_reviews: {
        type: Number,
        default: 0
    },

    created_at: {
        type: Date,
        default: Date.now,
        select: false
    },

    // CUSTOM FIELDS FOR VARIOUS CATEGORIES
    // Common requirements
    stock: {
        type: Number,
        required: true,
        maxLength: [99999, "Product stock is too large!"]
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

    price: {
        type: Number,
        required: true,
    },

    discount_percent: {
        type: Number,
        default: 0
    },

    final_price: {
        type: Number,
        required: true,
    },

    color: {
        type: String,
    },

    // Category -- Mobiles
    ram: {
        type: String,
    },

    rom: {
        type: String,
    },

    // Category -- Clothing, Shoes
    sizes: [
        {
            size:{
                type: String,
                required: true
            },
            price:{
                type: Number,
                required: true
            },
            discount_percent:{
                type: Number,
                required: true
            },
            stock:{
                type: Number,
                required: true
            }
        }
    ],

    // Category -- Laptops & Computers
    storage: {
        type: Number,
    },

    processer: {
        type: String,
    },

    // Category -- Beauty
    quantity: {
        type: Number,
    },

    // Category -- TV
    resolution: {
        type: String
    },

    variations:[{
        product:{
            type: Schema.Types.ObjectId,
            ref:"Product",
            required: true,
        },
        color:{
            type: String,
        },
        ram: {
            type: String,
        },
        rom: {
            type: String,
        },
        storage: {
            type: String,
        },
        processer: {
            type: String,
        },
        resolution: {
            type: String
        },
        image:{
            pub_id: {
                type: String,
                required: true
            },
            image_url: {
                type: String,
                required: true
            }
        }
    }],

    options: [
        {
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            discount_percent: {
                type: Number,
                required: true,
            },
        }
    ],

    bundles: [
        {
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            discount_percent: {
                type: Number,
                required: true,
            },
            products: [
                {
                    product_id: {
                        type: Schema.Types.ObjectId,
                        required: true,
                    },
                }
            ]
        }
    ]
})



// // Define a function that contains the validation logic
// const validateCustomFields = (doc) => {
//     // Get the product's category
//     const category = doc.category;

//     // Define an object with the allowed custom fields for each category
//     const allowedCustomFields = {
//         mobiles: ['ram', 'rom', 'color', 'price', 'discount_percent', 'unit' ]
//     };

//     // Get the allowed custom fields for this product's category
//     const allowedFields = allowedCustomFields[category];

//     // Check if any disallowed custom fields are present
//     for (const key in doc.variations) {
//         if (!allowedFields.includes(key)) {
//             // Remove the disallowed custom field
//             doc[key] = undefined;
//         }
//     }
// }

// // Define a pre-save hook to validate custom fields
// productSchema.pre('save', function (next) {
//     validateCustomFields(this);
//     next();
// });

// // Define a pre-validate hook to validate custom fields
// productSchema.pre('validate', function (next) {
//     validateCustomFields(this);
//     next();
// });

// // Define a pre-updateOne hook to validate custom fields
// productSchema.pre('updateOne', function (next) {
//     validateCustomFields(this.getUpdate());
//     next();
// });

// // Define a pre-updateMany hook to validate custom fields
// productSchema.pre('updateMany', function (next) {
//     validateCustomFields(this.getUpdate());
//     next();
// });

// // Define a pre-findOneAndUpdate hook to validate custom fields
// productSchema.pre('findOneAndUpdate', function (next) {
//     validateCustomFields(this.getUpdate());
//     next();
// });

// // Define a pre-findByIdAndUpdate hook to validate custom fields
// productSchema.pre('findByIdAndUpdate', function (next) {
//     validateCustomFields(this.getUpdate());
//     next();
// });




export const Product = model("Product", ProductSchema)
