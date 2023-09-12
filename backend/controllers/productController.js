import { Product } from '../models/productModel.js'
import { ErrorHandler } from '../utils/errorHandler.js';
import catchAsync from '../utils/catchAsync.js';
import { ApiFeatures } from '../utils/apiFeatures.js';
import { v4 as uuidv4 } from 'uuid';
import { Review } from '../models/reviewModel.js';



const allProperties = [ "name", "description", "price", "images", "stock", "discount_price", "final_price", "options", "bundles", "color", "ram", "rom", "processor", "resolution", "storage", "size", "sizes", "quantity", "variations", "brand", "category", "review_id" ]

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
        allProducts = allProducts.concat(similarProducts);
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
        const createdProduct = await Product.create({...product, brand, category, variations, seller_id: req.user._id, product_id, final_price});

        // All properties has all the flags that are present in a mongo document, to prevent a seller to fill irrelevent flags in the db, we are setting all the falg values which are not relevant to a category to undefined.
        allProperties.forEach((property) => {
            if(!properties.includes(property)){
                createdProduct[property] = undefined;
            }
        })
        
        createdProduct.final_price = final_price;
        createdProduct.brand = brand;
        createdProduct.category = category;
        createdProduct.variations = variations;
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
    const products = await apiFeatures.products;
    const product_count = (products.length > 0) ? products.length : 0;

    return res.json({
        success: true,
        products,
        product_count,
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

    const userReview = {
        user_id: req.user._id,
        name: req.user.name,
        rating,
        title,
        comment,
        images
    }

    let product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    if(!product.review_id){
        const productReviews = await Review.create({});
        product.review_id = productReviews._id;
        product.save({ validateBeforeSave: false })

        if(product.product_id){
            const products = await Product.find({ product_id: product.product_id });
            products.forEach(product => {
                product.review_id = productReviews._id;
                product.save({ validateBeforeSave: false })
            });
        }

        productReviews.reviews = productReviews.reviews.push(userReview);
        productReviews.total_reviews = productReviews.reviews.length;
        productReviews.rating = Math.round(rating);

        productReviews.save({ validateBeforeSave: false });

        return res.status(201).json({
            success: true,
            message: "Review added successfully!",
            review: productReviews
        });
    }

    const productReview = await Review.findById(product.review_id);

    const isReviewed = productReview.reviews.find((review) => {
        return review.user_id.toString() === req.user._id.toString();
    });

    if (isReviewed) {
        // If user has already reviewed the product, users old review gets updated to his new review
        productReview.reviews = productReview.reviews.map((review) => {
            if(review.user_id.toString() === req.user._id.toString()){
                let updatedRating = ((productReview.rating * productReview.total_reviews) - review.rating + userReview.rating) / productReview.total_reviews ;
                productReview.rating = Math.round(updatedRating * 10) / 10;
                return userReview;
            }
            return review;
        });

        productReview.save({ validateBeforeSave: false });

        return res.status(201).json({
            success: true,
            message: "Review updated successfully!",
            review: productReview,
        });
    }

    productReview.reviews.push(userReview);
    productReview.total_reviews = productReview.reviews.length;

    let total = 0;
    productReview.reviews.forEach((rev) => {
        total += rev.rating;
    })

    const totalRating = total / productReview.reviews.length;
    productReview.rating = Math.round(totalRating * 10)/10;

    await productReview.save({ validateBeforeSave: false });

    return res.status(201).json({
        success: true,
        message: "Review added successfully!",
        review: productReview,
    });
});



export const getAllProductReviews = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404))
    }

    if(!product.review_id){
        return res.json({
            success: true,
            reviews: [],
        })
    }
    const reviews = await Review.findById(product.review_id);

    return res.json({
        success: true,
        reviews
    })
})



export const deleteReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    if(!product.review_id){
        return next( new ErrorHandler("This product has not been reviewed yet!", 400));
    }

    const productReviews = await Review.findById(product.review_id);
    const isReviewed = productReviews.reviews.find((review) => {
        return review.user_id.toString() === req.user._id.toString();
    })

    if (!isReviewed) {
        return next(new ErrorHandler("You haven't reviewed this product yet!", 404));
    }

    let total = 0;
    productReviews.reviews = productReviews.reviews.filter((review) => {
        if (review.user_id.toString() === req.user._id.toString()) {
            return false;
        }
        total += review.rating;
        return true;
    });

    const totalRating = total / productReviews.reviews.length;
    productReviews.rating = Math.round(totalRating*10)/10;
    productReviews.total_reviews = productReviews.reviews.length;

    if(productReviews.reviews.length === 0){
        product.review_id = undefined;
        product.save({ validateBeforeSave: false })
    }

    productReviews.save({ validateBeforeSave: false });

    return res.json({
        success: true,
        message: "Successfully deleted your review!"
    })

})



export const addBundle = catchAsync( async(req, res, next) => {

    const { id } = req.params;
    const { name, description, discount_percent, products } = req.body;

    const product = await Product.findById(id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    if(product.seller_id.toString() !== req.user._id.toString()){
        return next(new ErrorHandler("You are not allowed to perform this action", 403));
    }

    let bundlePrice = 0;
    for(const bundleProduct of products){
        const product = await Product.findById(bundleProduct.product_id);
        if(!product){
            return next(new ErrorHandler("Products in the bundle not found!", 404));
        }
        if(product.seller_id.toString() !== req.user._id.toString()){
            return next(new ErrorHandler("Only the products with a common seller can be bundled together!", 400));
        }
        bundlePrice += product.price;
    }

    let final_price = Math.round((bundlePrice) - bundlePrice * discount_percent/100);

    const bundle = {
        name,
        description,
        price: bundlePrice + product.price,
        discount_percent,
        products,
        final_price
    }

    product.bundles.push(bundle);
    product.save({ validateBeforeSave: false })

    return res.json({
        success: true,
        message: "Added a bundle successfully",
        bundle: product.bundles
    })

});



export const addOptions = catchAsync(async(req, res, next) => {
    
    const { id } = req.params;
    const { name, discount_percent, description, price } = req.body;

    const product = await Product.findById(id);
    if(!product){
        return next( new ErrorHandler("Product not found!", 404));
    }

    if(product.seller_id.toString() !== req.user._id.toString()){
        return next(new ErrorHandler("You are not allowed to perform this action!", 403));
    }

    let final_price = Math.round((price) - price * discount_percent/100);

    const option = {
        name,
        description,
        price,
        discount_percent,
        final_price,
    }
    product.options.push(option);

    product.save({ validateBeforeSave: false })

    return res.json({
        success: true,
        message: "Options added successfully!",
        options: product.options
    })
})
