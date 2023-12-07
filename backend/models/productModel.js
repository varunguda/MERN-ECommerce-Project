import { Schema, model } from "mongoose";

const productCategories = [
    "Mobile Phone",
    "Laptop",
    "Computer",
    "Monitor",
    "Camera",
    "Clothing",
    "Footwear",
    "Watches",
    "Telivision",
    "Refrigerator",
    "Washing Machines",
    "Accessories",
    "Beauty & Health",
    "Audio devices"
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
        required: [true, "Please enter Product name"],
        minLength: [10, "Product name must contain atleast 10 characters!"],
        maxLength: [250, "Product name is too large!"],
    },

    description: {
        type: String,
        required: [true, "Please enter product Description"],
        minLength: [10, "Product description must contain atleast 5 characters!"],
        maxLength: [1000, "Product description is too large!"]
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
        minLength: [2, "Product brand name is too small!"],
        maxLength: [50, "Product brand name is too large!"],
        immutable: true,
    },

    stock: {
        type: Number,
        required: true,
        min: [10, "Product stock is too small!"],
        max: [100000, "Product stock is too large!"]
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
        min: [10, "Price must be atleast 10/-"],
        max: [999999, "Product price must be less than 10,00,000/-"]
    },

    discount_percent: {
        type: Number,
        default: 0,
        min: 0,
        max: 90,
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
        default: Date.now,
        select: false,
        immutable: true,
    },

    // CUSTOM FIELDS FOR VARIOUS CATEGORIES
    // Common requirements

    color: {
        type: String,
        minLength: [2, "Color name is too small!"],
        maxLength: [40, "Color name is too large!"],
    },

    // Category -- Mobiles
    ram: {
        type: Number,
        min: [1, "Ram value must be in range 1 and 9999"],
        max: [9999, "Ram value must be in range 1 and 9999"],
    },

    size:{
        type: String,
        minLength: [1, "Size value is too small!"],
        maxLength: [10, "Size value is too large!"],
    },

    // Category -- Laptops & Computers
    storage: {
        type: Number,
        min: [1, "Ram value must be in range 1 and 9999"],
        max: [9999, "Storage value must be in range 1 and 9999"]
    },

    processer: {
        type: String,
        minLength: [5, "Processor name is too small!"],
        maxLength: [100, "Processor name is too large!"]
    },


    // Category -- Beauty
    quantity: {
        type: Number,
        min: [1, "Quantity must be in range 1 and 9999"],
        max: [9999, "Quantity must be in range 0 and 9999"]
    },
    
    
    // Category -- TV
    resolution: {
        type: String
    },


    variations:[
        {
            type: String,
            enum: productVariations,
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


export const Product = model("Product", ProductSchema)





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




