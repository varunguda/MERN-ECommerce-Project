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
];

const productVariations = [
    "color",
    "ram",
    "rom",
    "storage",
    "quantity",
    "resolution",
    "processor"
]


const ProductSchema = new Schema({

    seller_id: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    product_id:{
        type: String
    },

    name: {
        type: String,
        required: [true, "Please enter product Name"],
        minLength: [5, "Product name must contain atleast 5 characters!"],
        maxLength: [80, "Product name is too large!"],
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
        enum: productCategories,
        immutable: true,
    },

    brand: {
        type: String,
        required: true,
        maxLength: [80, "Product brand name is too large!"],
        immutable: true,
    },

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

    review_id:{
        type: Schema.Types.ObjectId,
        ref: "Review",
    },

    created_at: {
        type: Date,
        default: () => {
            let now = new Date();
            now.setHours(now.getHours() + 5);
            now.setMinutes(now.getMinutes() + 30);
            return now;
        },
        select: false,
        immutable: true,
    },

    // CUSTOM FIELDS FOR VARIOUS CATEGORIES
    // Common requirements

    color: {
        type: String,
    },

    // Category -- Mobiles
    ram: {
        type: Number,
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

    size:{
        type: String,
    },

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

    variations:[
        {
            name:{
                type: String,
                enum: productVariations,
            }
        }
    ],

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
            final_price: {
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
            final_price: {
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
