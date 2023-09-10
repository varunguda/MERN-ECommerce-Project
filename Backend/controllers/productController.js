import { Product } from '../models/productModel.js'
import { ErrorHandler } from '../utils/errorHandler.js';
import catchAsync from '../utils/catchAsync.js';
import { ApiFeatures } from '../utils/apiFeatures.js';
import { v4 as uuidv4 } from 'uuid';
import { areSameKeyValues } from '../utils/extras.js';


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
})



export const createProduct = catchAsync(async (req, res, next) => {

    const products = req.body;
    const createdProducts = [];
    const product_id = (products.length>1) ? uuidv4() : undefined;
    
    const areSame = areSameKeyValues(products, ["brand", "category", "variations"]);
    if(!areSame){
        return next(new ErrorHandler("The Brand, Category and Variations of similar products must be the same!", 400))
    }

    for(const product of products){

        const {
            name,
            description,
            price,
            category,
            stock,
            discount_percent,
            images,
            brand,
            variations,
            color,
            ram,
            rom,
            resolution,
            sizes,
            storage,
            processor,
            quantity
        } = product;

        const final_price = Math.round(price - (price * discount_percent/100));

        const commonFields  = {
            name,
            description,
            price,
            category,
            stock,
            discount_percent,
            images,
            brand,
            variations,
            final_price
        }

        let productFields; 

        switch(product.category){

            case("Mobile Phone"):{
                productFields = {
                    ...commonFields,
                    ram,
                    rom,
                    color,
                    resolution,
                    processor,
                }
                break;
            }

            case("Computer"):
            case("Laptop"):{
                productFields = {
                    ...commonFields,
                    color,
                    ram,
                    resolution,
                    storage,
                    processor,
                }
                break;
            }

            case("Monitor"):{
                productFields = {
                    ...commonFields,
                    color,
                    resolution,
                };
                break;
            }

            case("Clothing"):
            case("Shoes"):{
                productFields = {
                    ...commonFields,
                    color,
                    sizes,
                };
                break;
            }

            case("Watches"):{
                productFields = {
                    ...commonFields,
                    color,
                };
                break;
            }

            case("Telivision"):{
                productFields = {
                    ...commonFields,
                    color,
                    resolution,
                    storage,
                };
                break;
            }

            case("Refrigerator"):{
                productFields = {
                    ...commonFields,
                    color,
                    storage,
                };
                break;
            }

            case("Computer Accessories"):
            case("Headphones & Earphones"):
            case("Mobile Accessories"):{
                productFields = {
                    ...commonFields,
                    color,
                    storage,
                };
                break;
            }

            case("Beauty & Health"):{
                productFields = {
                    ...commonFields,
                    color,
                    quantity
                };
                break;
            }
        }

        const createdProduct = await Product.create({
            seller_id: req.user._id,
            product_id,
            ...productFields,
        });

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

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 400));
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    const Product = await apiFeatures.Product;

    const product_count = Product.length;

    return res.json({
        success: true,
        Product,
        product_count
    })
})



export const updateMyProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const { name, description, price, category, images, stock, discount_price } = req.body;
    const product = await Product.findOneAndUpdate({ _id: id, seller_id: req.user._id }, { name, description, price, category, images, stock, discount_price },
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