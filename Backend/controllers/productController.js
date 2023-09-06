import { Products } from '../models/productModel.js'
import { ErrorHandler } from '../utils/errorHandler.js';
import catchAsync from '../utils/catchAsync.js';
import { ApiFeatures } from '../utils/apiFeatures.js';



export const getAllProducts = catchAsync(async (req, res, next) => {

    const productCount = await Products.countDocuments()
    const apiFeatures = new ApiFeatures(Products.find(), req.query).search().filter().pagination(10)
    const products = await apiFeatures.products;
    return res.json({
        success: true,
        products,
        product_count: productCount,
    })
})



export const getProductDetails = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Products.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 400));
    }
    return res.json({
        success: true,
        product
    })
})



export const createProduct = catchAsync(async (req, res, next) => {

    const { name, description, price, category } = req.body;

    const product = await Products.create({ name, description, price, category, seller_id: req.user._id });

    return res.status(201).json({
        success: true,
        message: "Product added successfully!",
        product
    })

})



export const updateAnyProduct = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const product = await Products.findByIdAndUpdate(id, req.body,
        {
            new: true,
            runValidators: true
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

    const product = await Products.findByIdAndDelete(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 400));
    }

    return res.json({
        success: true,
        message: "Product has been deleted successfully!"
    })
})



export const getMyProducts = catchAsync(async (req, res, next) => {

    const apiFeatures = new ApiFeatures(Products.find({ seller_id: req.user._id }), req.query).search().pagination(10);

    const products = await apiFeatures.products;

    const product_count = products.length

    return res.json({
        success: true,
        products,
        product_count
    })
})



export const updateMyProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Products.findOneAndUpdate({ _id: id, seller_id: req.user._id }, { ...req.body },
        {
            new: true,
            runValidators: true
        }
    )
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    return res.json({
        success: true,
        message: "Product details updated successfully!"
    })
})



export const deleteMyProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Products.findOneAndDelete({ _id: id, seller_id: req.user._id })
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

    let product = await Products.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    const isReviewed = product.reviews.find((review) => {
        return review.user_id.toString() === req.user._id.toString() // returns true if the user already reviewed the product
    })

    // console.log(review.user_id.toString() === req.user._id.toString())

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

    const product = await Products.findById(id);
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

    const product = await Products.findById(id);
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