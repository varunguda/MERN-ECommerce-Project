import { Product } from '../models/productModel.js'
import { ErrorHandler } from '../utils/errorHandler.js';
import catchAsync from '../utils/catchAsync.js';
import { ApiFeatures } from '../utils/apiFeatures.js';
import { v4 as uuidv4 } from 'uuid';



const allProperties = [ "name", "description", "price", "images", "stock", "discount_price", "final_price", "options", "bundles", "color", "ram", "rom", "processor", "resolution", "storage", "final_price", "size", "sizes", "quantity", "variations", "brand", "category", "reviews", "rating", "total_reviews" ]

const commonProperties = ["name", "description", "price", "images", "stock", "discount_price", "options", "bundles" ]

const categoryConfig = {

    "Mobile Phone": {
        properties: [ ...commonProperties, "ram", "rom", "color", "resolution", "processor" ]
    },

    "Laptop":{
        properties: [...commonProperties, "ram", "color", "resolution", "processor", "storage", "size"]
    },

    "Monitor":{
        properties:[ ...commonProperties, "color", "resolution", "size" ]
    },

    "Clothing":{
        properties: [...commonProperties, "sizes", "color" ]
    },

    "Shoes":{
        properties: [...commonProperties, "colors", "sizes"]
    },

    "Watches": {
        properties: [ ...commonProperties, "color" ]
    },

    "Telivision": {
        properties: [...commonProperties, "color", "resolution", "size" ],
    },

    "Refrigerator":{
        properties:[...commonProperties, "color", "storage"],
    },

    "Computer Accessories":{
        properties: [...commonProperties, "color", "size"],
    },
    
    "Mobile Accessories":{
        properties: [...commonProperties, "color", "size"]
    },

    "Headphones & Earphones":{
        properties: [...commonProperties, "color", "size"],
    },

    "Beauty & Health":{
        properties: [...commonProperties, "color", "quantity"],
    }
}



export const getAllProducts = catchAsync(async (req, res, next) => {
    const productCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(10)
    const products = await apiFeatures.products;

    return res.json({
        success: true,
        products,
        product_count: productCount,
    })
})



export const getProductDetails = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let allProducts = [];
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 400));
    }

    allProducts.push(product);

    if(product.product_id){
        const similarProducts = await Product.find({product_id: product.product_id, _id: { $ne : product._id}});
        allProducts = allProducts.concat(similarProducts)
    }

    return res.json({
        success: true,
        products: allProducts
    })
});



export const createProduct = catchAsync(async (req, res, next) => {

    const { products, variations, category, brand } = req.body;
    const createdProducts = [];
    const product_id = (products.length>1) ? uuidv4() : undefined;

    if(!categoryConfig.hasOwnProperty(category)){
        return next(new ErrorHandler("This category is not available!", 400));
    }

    const { properties } = categoryConfig[category];

    for(const product of products){

        const final_price = Math.round(product.price - ( product.price * product.discount_percent/100));

        // creating a product with all the data provided by the seller
        const createdProduct = await Product.create({...product, brand, category, variations, seller_id: req.user._id, product_id});

        // All properties has all the flags that are present in a mongo document, to prevent a seller to fill irrelevent flags in the db, we are setting all the falg values which are not relevant to a category to undefined.
        allProperties.forEach((property) => {
            if(!properties.includes(property)){
                createdProduct[property] = undefined;
            }
        })
        
        createdProduct.final_price = final_price;
        createdProduct.created_at = new Date(Date.now());

        // Updating the product saved
        createdProduct.save({ validateBeforeSave: false });
        createdProducts.push(createdProduct);
    }

    return res.status(201).json({
        success: true,
        message: "Products added successfully!",
        products: createdProducts,
    })
})



export const updateAnyProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, {...req.body}, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        return next(new ErrorHandler("Product not found!", 400));
    }

    return res.json({
        success: true,
        message: "Product updated successfully!"
    })
})



export const deleteAnyProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 400));
    }

    return res.json({
        success: true,
        message: "Product has been deleted successfully!"
    })
})



export const getMyProducts = catchAsync(async (req, res, next) => {

    const apiFeatures = new ApiFeatures(Product.find({ seller_id: req.user._id }), req.query).search().pagination(10);
    const products = await apiFeatures.Product;
    const product_count = products.length;

    return res.json({
        success: true,
        products,
        product_count
    })
})



export const updateMyProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, seller_id: req.user._id })
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    if(categoryConfig.hasOwnProperty(product.category)){
        const { properties } = categoryConfig[product.category];

        properties.forEach((property) => {
            product[property] = req.body[property] || undefined;
        })
    }

    product.save({validateBeforeSave: false})

    return res.json({
        success: true,
        message: "Product details updated successfully!"
    })
})



export const deleteMyProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id, seller_id: req.user._id })
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    return res.json({
        success: true,
        message: "Successfully deleted your product!"
    })
})



export const craeateProductReview = catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const { title, comment, rating, images } = req.body;

    const review = {
        user_id: req.user._id,
        name: req.user.name,
        rating,
        title,
        comment
    }

    let product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    const isReviewed = product.reviews.find((review) => {
        return review.user_id.toString() === req.user._id.toString()
    })
    
    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review.user_id.toString() === req.user._id.toString()) {
                review.title = title,
                    review.rating = rating,
                    review.comment = comment
            }
        })
    }
    else {
        product.reviews.push(review);
        product.total_reviews = product.reviews.length;
    }

    let total = 0;

    product.reviews.forEach((rev) => {
        total += rev.rating;
    })

    const totalRating = total / product.reviews.length;

    product.rating = totalRating;

    product = await product.save({ validateBeforeSave: false });

    return res.status(201).json({
        success: true,
        message: "Review added successfully!",
        product
    });
})



export const getAllProductReviews = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        next(new ErrorHandler("Product not found!", 404))
    }

    return res.json({
        success: true,
        reviews: product.reviews
    })
})



export const deleteReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    if (product.reviews.length === 0) {
        return next(new ErrorHandler("There are no reviews to this product!"));
    }

    const isReviewed = product.reviews.find((review) => {
        return review.user_id.toString() === req.user._id.toString();
    })

    if (!isReviewed) {
        return next(new ErrorHandler("You haven't reviewed this product yet!", 400));
    }

    let total = 0;

    product.reviews = product.reviews.filter((review) => {
        if (review.user_id.toString() === req.user._id.toString()) {
            return false;
        }
        total += review.rating;
        return true;
    });

    const totalRating = total / product.reviews.length;

    product.rating = totalRating;

    product.total_reviews = product.reviews.length;

    product.save({ validateBeforeSave: false });

    return res.json({
        success: true,
        message: "Successfully deleted your review!"
    })

})