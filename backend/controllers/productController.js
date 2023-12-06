import { Product } from '../models/productModel.js';
import { Users } from "../models/userModel.js";
import { ErrorHandler } from '../utils/errorHandler.js';
import catchAsync from '../utils/catchAsync.js';
import { ApiFeatures, pagination, sortBy } from '../utils/apiFeatures.js';
import { v4 as uuidv4 } from 'uuid';
import { Review } from '../models/reviewModel.js';
import { Orders } from '../models/orderModel.js';
import { orderHtml } from '../html/orderHtml.js';
import { sendEmail } from '../utils/sendMail.js';
import { MeritMeter } from '../utils/meritMeter.js';
import { createProductValidator, productValidator, reviewValidator } from '../validators/productValidators.js';
import { validationError } from '../validators/validationError.js';
import cloudinary from "cloudinary";


const allProperties = ["name", "description", "price", "images", "stock", "discount_percent", "final_price", "options", "bundles", "color", "ram", "processor", "resolution", "storage", "size", "quantity", "variations", "brand", "category", "review_id"];

const commonProperties = ["name", "description", "price", "images", "stock", "discount_percent", "options", "bundles"];


const categoryConfig = {

    "Mobile Phone": {
        properties: [...commonProperties, "ram", "storage", "color", "resolution", "processor"]
    },

    "Laptop": {
        properties: [...commonProperties, "ram", "color", "resolution", "processor", "storage", "size"]
    },

    "Monitor": {
        properties: [...commonProperties, "color", "resolution", "size"]
    },

    "Camera": {
        properties: [...commonProperties, "color"]
    },

    "Clothing": {
        properties: [...commonProperties, "size", "color"]
    },

    "Footwear": {
        properties: [...commonProperties, "color", "size"]
    },

    "Watches": {
        properties: [...commonProperties, "color"]
    },

    "Telivision": {
        properties: [...commonProperties, "color", "resolution", "size"]
    },

    "Refrigerator": {
        properties: [...commonProperties, "color", "size"]
    },

    "Washing Machines": {
        properties: [...commonProperties, "color", "size"],
    },

    "Accessories": {
        properties: [...commonProperties, "color", "size"]
    },

    "Audio devices": {
        properties: [...commonProperties, "color"]
    },

    "Beauty & Health": {
        properties: [...commonProperties, "quantity"]
    }
};



export const getAllProducts = catchAsync(async (req, res, next) => {

    let apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().sortByCreate();

    const allProducts = await apiFeatures.items;
    const productCount = allProducts.length;
    let exist = false;

    const { keyword } = req.query;

    let minPrice = allProducts[0] ? allProducts[0].final_price : 100000;
    let maxPrice = 0;
    let brands = [];
    const categories = {};
    for (let i = 0; i < Object.keys(categoryConfig).length; i++) {
        categories[Object.keys(categoryConfig)[i]] = 0;
    }

    // variations or facets
    let colorOptions = {};
    let ramOptions = {
        16: 0,
        12: 0,
        8: 0,
        6: 0,
        4: 0,
        3: 0,
    };
    let storageOptions = {};

    if (!!keyword) {
        const existProducts = await Product.find({ $or: [{ name: { $regex: keyword, $options: "i" } }, { brand: { $regex: keyword, $options: "i" } }] });
        if (existProducts && existProducts.length > 0) {
            exist = true;
        }
        existProducts.forEach((prod) => {
            if (prod.final_price > maxPrice) {
                maxPrice = prod.final_price;
            }
            if (prod.final_price < minPrice) {
                minPrice = prod.final_price;
            }
            if (!brands.includes(prod.brand)) {
                brands.push(prod.brand);
            }
            if (prod.color) {
                if (colorOptions[prod.color] === undefined) {
                    colorOptions[prod.color] = 1;
                }
                else if (colorOptions[prod.color] >= 0) {
                    colorOptions[prod.color] += 1;
                }
            }
            if (prod.ram) {
                if (ramOptions[prod.ram] !== undefined && ramOptions[prod.ram] >= 0) {
                    ramOptions[prod.ram] += 1;
                }
                else if (prod.ram > 16) {
                    ramOptions[16] += 1;
                }
                else if (prod.ram < 3) {
                    ramOptions[3] += 1;
                }
            }
            if (prod.storage) {
                if (storageOptions[prod.storage] === undefined) {
                    storageOptions[prod.storage] = 1;
                }
                else if (storageOptions[prod.storage] >= 0) {
                    storageOptions[prod.storage] += 1;
                }
            }
            categories[prod.category] += 1;
        })
    }
    else {
        exist = true;
        allProducts.forEach((prod) => {
            categories[prod.category] += 1;
        })
    }

    let customer_ratings = {
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    }

    const products = pagination(allProducts, 10, req.query.page);

    let updatedProducts = [];

    for (let i = 0; i < products.length; i++) {
        if (products[i].review_id) {
            const review_data = await Review.findById(products[i].review_id);
            if (!review_data) {
                updatedProducts.push({ rating: 0, total_reviews: 0, ...products[i]._doc });
            }
            else {
                updatedProducts.push({ rating: review_data.rating, total_reviews: review_data.total_reviews, ...products[i]._doc });
                if (review_data.rating === 5) {
                    customer_ratings[4] += 1;
                }
                else {
                    customer_ratings[Math.floor(review_data.rating)] += 1;
                }
            }
        }
        else {
            updatedProducts.push({ rating: 0, total_reviews: 0, ...products[i]._doc });
        }
    }

    updatedProducts = updatedProducts.map(prod => {

        const { _id, rating, total_reviews, name, category, brand, stock, price, final_price, discount_percent, images, description, variations } = prod;

        let obj = {};
        if (variations.length > 0) {
            variations.forEach((vari) => {
                if (categoryConfig[category].properties.includes(vari)) {
                    obj[vari] = prod[vari];
                }
            })
        }

        return ({ _id, rating, total_reviews, name, category, brand, stock, price, final_price, discount_percent, images: images[0], description, ...obj, variations });
    });

    const queryRatings = req.query.c_ratings;
    if (queryRatings && queryRatings.split(",").length > 0) {
        const reviewsArr = queryRatings.split(",");
        updatedProducts = updatedProducts.filter((prod) => {
            if (prod.rating) {
                return ((prod.rating === 5) ? reviewsArr.includes('4') : reviewsArr.includes(Math.floor(prod.rating).toString()));
            }
        })
    }

    let filters = {};

    if (Object.keys(colorOptions).reduce((count, color) => { return count + colorOptions[color] }, 0)) {
        filters = { ...filters, color: colorOptions }
    }
    if (Object.keys(ramOptions).reduce((count, ram) => { return count + ramOptions[ram] }, 0)) {
        filters = { ...filters, ram: ramOptions }
    }
    if (Object.keys(storageOptions).reduce((count, storage) => { return count + storageOptions[storage] }, 0)) {
        filters = { ...filters, storage: storageOptions }
    }

    const { sort_by } = req.query;
    if (sort_by) {
        updatedProducts = sortBy(updatedProducts, sort_by);
    }

    return res.json({
        success: true,
        products: updatedProducts,
        product_count: productCount,
        max_price: maxPrice,
        min_price: minPrice,
        exist,
        brands,
        categories,
        filters,
        customer_ratings
    });
});



export const getProductDetails = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    let variationProducts = [];

    if (product.product_id && product.variations.length > 0) {
        const similarProducts = await Product.find({ product_id: product.product_id });

        similarProducts.forEach((prod) => {
            let obj = {};
            obj._id = prod._id;
            for (const variation of product.variations) {
                obj.image = prod.images[0].image_url;
                obj[variation] = prod[variation];
            }
            variationProducts.push(obj);
        })
    }

    const seller = await Users.findById(product.seller_id).select("+is_admin");

    let updatedProduct;
    if (product.review_id) {
        const review_data = await Review.findById(product.review_id);
        if (review_data) {
            updatedProduct = { rating: review_data.rating, total_reviews: review_data.total_reviews, ...product._doc, seller_merit: seller.is_admin ? "" : Math.round(seller.seller_merit), seller_name: seller.is_admin ? "Admin" : seller.name };
        }
    } else {
        updatedProduct = { ...product._doc, seller_merit: seller.is_admin ? "" : Math.round(seller.seller_merit), seller_name: seller.is_admin ? "Admin" : seller.name };
    }

    return res.json({
        success: true,
        product: updatedProduct,
        variation_products: variationProducts,
    })
});



export const getSingleProductDetails = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product doesn't exist", 404));
    }

    return res.json({
        success: true,
        product,
    })
});



export const createProduct = [

    ...createProductValidator,

    catchAsync(async (req, res, next) => {

        validationError(req);

        const { products, variations, category, brand } = req.body;

        const createdProducts = [];
        const product_id = (products.length > 1) ? uuidv4() : undefined;

        if (!categoryConfig.hasOwnProperty(category)) {
            return next(new ErrorHandler("The category provided is not available!", 400));
        }

        const { properties } = categoryConfig[category];

        for (const product of products) {

            let final_price;
            if (!product.discount_percent) {
                final_price = Math.round(product.price);
            }
            else {
                final_price = Math.round(product.price - (product.price * product.discount_percent / 100));
            }

            let uploadedImages = [];
            for (let i = 0; i < ((product.images.length > 10) ? 10 : product.images.length); i++) {
                let myCloud = {};
                myCloud = await cloudinary.v2.uploader.upload(product.images[i], {
                    folder: "Product Images",
                });

                Object.keys(myCloud).length && uploadedImages.push(
                    {
                        pub_id: myCloud.public_id,
                        image_url: myCloud.secure_url
                    }
                );
            };

            if (uploadedImages.length !== product.images.length) {
                for (const image of uploadedImages) {
                    await cloudinary.v2.uploader.destroy(image.pub_id);
                }
                return next(new ErrorHandler("Seems like something went wrong while uploading images, Please try again!"));
            };

            // creating a product with all the data provided by the seller
            const createdProduct = await Product.create({ ...product, brand, category, seller_id: req.user._id, product_id, final_price, images: uploadedImages});

            // All properties has all the flags that are present in a mongo document, to prevent a seller to fill irrelevent flags in the db, we are setting all the falg values which are not relevant to a category to undefined.
            allProperties.forEach((property) => {
                if (!properties.includes(property)) {
                    createdProduct[property] = undefined;
                }
            });

            createdProduct.final_price = final_price;
            createdProduct.brand = brand;
            createdProduct.category = category;
            if (products.length > 1) {
                createdProduct.variations = variations;
            }

            await createdProduct.save({ validateBeforeSave: false });
            createdProducts.push(createdProduct);
        }

        return res.status(201).json({
            success: true,
            message: `${products.length === 1 ? "Product" : "Products"} added successfully!`
        })
    })
];



export const updateAnyProduct = [

    ...productValidator(),

    catchAsync(async (req, res, next) => {

        validationError(req);

        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return next(new ErrorHandler("Product not found!", 400));
        }

        if (categoryConfig.hasOwnProperty(product.category)) {
            const { properties } = categoryConfig[product.category];

            properties.forEach((property) => {
                if(property !== "images"){
                    product[property] = (req.body[property] !== undefined) ? req.body[property] : undefined;
                }
            })
        }

        product.final_price = Math.round(product.price - (product.price * product.discount_percent / 100));

        await product.save({ validateBeforeSave: false });

        return res.json({
            success: true,
            message: "Product updated successfully!"
        })
    })
];



export const deleteAnyProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 400));
    }

    for (const image of product.images) {
        await cloudinary.v2.uploader.destroy(image.pub_id);
    }

    const orders = await Orders.find({});

    let totalCancelledOrders = 0;
    for (const order of orders) {

        let totalItemsPrice = 0;
        order.order_items = order.order_items.map((item) => {
            if ((item.product.toString() === product.toString()) && (item.product_status === "Processing")) {
                item.product_status = 'Cancelled';
                totalCancelledOrders += 1;
                return item;
            }
            totalItemsPrice += item.price;
            return item;
        });

        order.items_price = totalItemsPrice;
        order.tax_price = totalItemsPrice * 18 / 100;
        order.total_price = order.items_price + order.tax_price + order.shipping_cost;

        if (totalCancelledOrders > 0) {
            await order.save({ validateBeforeSave: false });
        }
    }

    return res.json({
        success: true,
        message: "Product has been deleted successfully!"
    })
});



export const getMyProducts = catchAsync(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(Product.find({ seller_id: req.user._id }), req.query).search().sortByCreate();
    let allProducts = await apiFeatures.items;
    const product_count = allProducts.length;

    let products = await pagination(allProducts, 10, req.query.page);

    products = products.map(prod => {

        const { _id, rating, total_reviews, name, category, brand, stock, price, final_price, discount_percent, images, description, variations } = prod;

        let obj = {};
        if (variations) {
            variations.forEach((vari) => {
                if (categoryConfig[category].properties.includes(vari)) {
                    obj[vari] = prod[vari];
                }
            })
        }

        return ({ _id, rating, total_reviews, name, category, brand, stock, price, final_price, discount_percent, images, description, ...obj, variations });
    });

    return res.json({
        success: true,
        products,
        product_count,
    })
});



export const updateMyProduct = [

    ...productValidator(),

    catchAsync(async (req, res, next) => {

        validationError(req);

        const { id } = req.params;

        const product = await Product.findOne({ _id: id, seller_id: req.user._id })
        if (!product) {
            return next(new ErrorHandler("Product not found!", 404));
        }

        if (categoryConfig.hasOwnProperty(product.category)) {
            const { properties } = categoryConfig[product.category];

            properties.forEach((property) => {
                if(property !== "images"){
                    product[property] = (req.body[property] !== undefined) ? req.body[property] : undefined;
                }
            })
        };

        product.final_price = Math.round(product.price - (product.price * product.discount_percent / 100));

        await product.save({ validateBeforeSave: false });

        return res.json({
            success: true,
            message: "Product details updated successfully!"
        });
    })
];



export const deleteMyProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id, seller_id: req.user._id });
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    for (const image of product.images) {
        await cloudinary.v2.uploader.destroy(image.pub_id);
    }

    const orders = await Orders.find({});

    let totalCancelledOrders = 0;
    for (const order of orders) {
        const user = await Users.findById(order.user);

        let totalItemsPrice = 0;
        order.order_items = order.order_items.map((item) => {
            if ((item.product.toString() === product.toString()) && (item.product_status === "Processing")) {
                item.product_status = 'Cancelled';
                totalCancelledOrders += 1;
                return item;
            }
            totalItemsPrice += item.price;
            return item;
        });

        order.items_price = totalItemsPrice;
        order.tax_price = totalItemsPrice * 18 / 100;
        order.total_price = order.items_price + order.tax_price + order.shipping_cost;

        if (totalCancelledOrders > 0) {
            await order.save({ validateBeforeSave: false });

            const html = orderHtml({
                head: "Order Cancelled!",
                user_name: user.name,
                head_caption: `We regret to inform you that your order has been cancelled. Below are the details of your cancelled order:`,
                order,
                order_caption: `<strong>Reason for this inconvinience:</strong> Seller has tookdown his product and the product is no longer available on ManyIN.`,
                button_url: `${req.protocol}://${req.hostname}/profile/orders`,
                button_text: "Check Order Status",
                mail_caption: "We apologize for any inconvenience we may have caused. If you have any questions or concerns, please don't hesitate to reply to this Mail."
            });

            sendEmail({
                email: user.email,
                subject: "Order Cancelled!",
                html
            });
        }
    }

    const meritMeter = new MeritMeter(totalCancelledOrders, req.user._id);
    meritMeter.reduceMeritBy(3);

    return res.json({
        success: true,
        message: "Successfully deleted your product!"
    })
});



export const createProductReview = [

    ...reviewValidator,

    catchAsync(async (req, res, next) => {

        validationError(req);

        const { id } = req.params;
        const { title, comment, rating } = req.body;

        const userReview = {
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

        if (!product.review_id) {
            const productReviews = await Review.create({});
            product.review_id = productReviews._id;
            await product.save({ validateBeforeSave: false })

            if (product.product_id) {
                const products = await Product.find({ product_id: product.product_id });
                products.forEach(async (product) => {
                    product.review_id = productReviews._id;
                    await product.save({ validateBeforeSave: false })
                });
            }

            const orders = await Orders.find({ user: req.user._id });
            if (!orders) {
                userReview.is_verified_purchase = false;
            }

            orders.map((order) => {
                order.order_items.map((item) => {
                    if ((item.product.toString() === product._id.toString()) || item.product_status === "Delivered") {
                        userReview.is_verified_purchase = true;
                    }
                    else {
                        userReview.is_verified_purchase = false;
                    }
                })
            })

            userReview.product_name = product.name;

            productReviews.reviews = productReviews.reviews.push(userReview);
            productReviews.total_reviews = productReviews.reviews.length;
            productReviews.rating = Math.round(rating);

            await productReviews.save({ validateBeforeSave: false });

            return res.status(201).json({
                success: true,
                message: "Review added successfully!",
                review: productReviews
            });
        }

        const productReview = await Review.findById(product.review_id);
        if (!productReview) {
            product.review_id = undefined;
            await product.save({ validateBeforeSave: false });
            return next(new ErrorHandler("Something went wrong, please try again!", 400));
        }

        let isReviewed = false;

        if (productReview && productReview.reviews) {
            isReviewed = productReview.reviews.some((review) => review.user_id.toString() === req.user._id.toString());
        }

        if (isReviewed) {
            // If user has already reviewed the product, users old review gets updated to his new review
            productReview.reviews = productReview.reviews.map((review) => {
                if (review.user_id.toString() === req.user._id.toString()) {
                    let updatedRating = ((productReview.rating * productReview.total_reviews) - review.rating + userReview.rating) / productReview.total_reviews;
                    productReview.rating = Math.round(updatedRating * 10) / 10;
                    return userReview;
                }
                return review;
            });

            await productReview.save({ validateBeforeSave: false });

            return res.status(201).json({
                success: true,
                message: "Review updated successfully!",
                review: productReview,
            });
        }

        const orders = await Orders.find({ user: req.user._id });
        if (!orders) {
            userReview.is_verified_purchase = false;
        }


        orders.map((order) => {
            order.order_items.map((item) => {
                if ((item.product.toString() === product._id.toString()) || item.product_status === "Delivered") {
                    userReview.is_verified_purchase = true;
                } else {
                    userReview.is_verified_purchase = false;
                }
            })
        })

        userReview.product_name = product.name;

        productReview.reviews.push(userReview);
        productReview.total_reviews = productReview.reviews.length;

        let total = 0;
        productReview.reviews.forEach((rev) => {
            total += rev.rating;
        })

        const totalRating = total / productReview.reviews.length;
        productReview.rating = Math.round(totalRating * 10) / 10;

        await productReview.save({ validateBeforeSave: false });

        return res.status(201).json({
            success: true,
            message: "Review added successfully!",
            review: productReview
        });
    })
];



export const getAllProductReviews = catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const { page } = req.query;

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404))
    }

    if (!product.review_id) {
        return res.json({
            success: true,
            reviews: [],
        })
    }

    const reviews = await Review.findById(product.review_id);
    if (!reviews) {
        product.review_id = undefined;
        await product.save({ validateBeforeSave: false });
        return next(new ErrorHandler("Something went wrong, please try again!", 400));
    }
    const currentPage = page || 1;
    let productReviews = reviews.reviews.slice(10 * (currentPage - 1), (10 * (currentPage - 1)) + 10);


    if (req.user && productReviews.length > 0) {
        productReviews = productReviews.map((rev) => {
            let liked = false;
            let disliked = false;

            if (rev.liked_users && rev.liked_users.some((user) => user.user_id.toString() === req.user._id.toString())) {
                liked = true;
            }
            else if (rev.disliked_users && rev.disliked_users.some((user) => user.user_id.toString() === req.user._id.toString())) {
                disliked = true;
            }
            return { ...rev._doc, liked, disliked }
        })

    } else if (productReviews.length > 0) {

        productReviews = productReviews.map((rev) => {
            return { ...rev._doc, liked: false, disliked: false }
        })
    }

    const newReviews = { ...reviews._doc, reviews: productReviews, page: Number(currentPage) };

    return res.json({
        success: true,
        review: newReviews,
    })
});



export const deleteReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    if (!product.review_id) {
        return next(new ErrorHandler("This product has not been reviewed yet!", 400));
    }

    const productReviews = await Review.findById(product.review_id);
    const isReviewed = productReviews.reviews.find((review) => {
        return review.user_id.toString() === req.user._id.toString();
    });

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

    let totalRating = total / productReviews.reviews.length;
    productReviews.rating = Math.round(totalRating * 10) / 10;
    productReviews.total_reviews = productReviews.reviews.length;

    if (productReviews.reviews.length === 0) {
        const products = await Product.find({ product_id: product.product_id });
        for (const prod of products) {
            prod.review_id = undefined;
            await prod.save({ validateBeforeSave: false });
        }
        await productReviews.deleteOne();

        return res.json({
            success: true,
            message: "Successfully deleted your review!",
            review: {}
        });
    }
    else {
        await productReviews.save({ validateBeforeSave: false });

        return res.json({
            success: true,
            message: "Successfully deleted your review!",
            review: productReviews
        });
    }
});



export const addBundle = catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const { name, description, discount_percent, products } = req.body;

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    if (product.seller_id.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You are not allowed to perform this action", 403));
    }

    let bundlePrice = 0;
    for (const bundleProduct of products) {
        const product = await Product.findById(bundleProduct.product_id);
        if (!product) {
            return next(new ErrorHandler("Products in the bundle not found!", 404));
        }
        if (product.seller_id.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler("Only the products with a common seller can be bundled together!", 400));
        }
        bundlePrice += product.price;
    }

    let final_price = Math.round((bundlePrice) - bundlePrice * discount_percent / 100);

    const bundle = {
        name,
        description,
        price: Math.round(bundlePrice + product.price),
        discount_percent,
        products,
        final_price
    }

    product.bundles.push(bundle);
    await product.save({ validateBeforeSave: false })

    return res.json({
        success: true,
        message: "Added a bundle successfully",
        bundle: product.bundles
    })

});



export const addOptions = catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const { name, discount_percent, description, price } = req.body;

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    if (product.seller_id.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You are not allowed to perform this action!", 403));
    }

    let final_price = Math.round((price) - price * discount_percent / 100);

    const option = {
        name,
        description,
        price,
        discount_percent,
        final_price,
    }
    product.options.push(option);

    await product.save({ validateBeforeSave: false })

    return res.json({
        success: true,
        message: "Options added successfully!",
        options: product.options
    })
});



export const getProductsOfSeller = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const user = await Users.findById(id).select("+is_seller");
    if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
    }

    if (!user.is_seller) {
        return next(new ErrorHandler("Seller not found!", 404));
    }

    let allProducts = await Product.find({ seller_id: user._id });

    allProducts = allProducts.map(({ _id, rating, total_reviews, name, category, brand, stock, price, final_price, discount_percent, images }) => ({
        _id,
        rating,
        total_reviews,
        name,
        category,
        brand,
        stock,
        price,
        final_price,
        discount_percent,
        images: images[0],
    }));

    const products = pagination(allProducts, 10, req.query.page);

    return res.json({
        success: true,
        products
    })
});



export const getAllBundleProducts = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    if (product.bundles.length === 0) {
        return next(new ErrorHandler("This product has no bundles", 400));
    }

    const newBundles = [];
    let i = 0;
    for (const bundle of product.bundles) {
        let j = 0;
        newBundles.push({ ...bundle._doc });
        for (let prod of bundle.products) {
            const bundleProduct = await Product.findById(prod.product_id);
            if (!bundleProduct) {
                return next(new ErrorHandler("This product is no longer available", 400));
            }
            if (!j) {
                newBundles[i].products = [{ ...product._doc }, { ...bundleProduct._doc }];
            } else {
                newBundles[i].products.push({ ...bundleProduct._doc })
            }
            j++;
        }
        i++;
    }

    return res.json({
        success: true,
        bundles: newBundles
    })

});



export const toggleLikeOfAReview = catchAsync(async (req, res, next) => {

    const { reviews, review } = req.body;

    const prodReview = await Review.findById(reviews);
    if (!prodReview) {
        return next(new ErrorHandler("Reviews not found!", 404));
    }

    if (!prodReview.reviews) {
        return next(new ErrorHandler("This product has not been reviewed yet!", 400));
    }

    if (!prodReview.reviews.some((rev) => (rev._id.toString() === review.toString()))) {
        return next(new ErrorHandler("Review not found!", 404));
    }


    let liked = false;
    prodReview.reviews = prodReview.reviews.map((rev) => {

        if (rev._id.toString() === review.toString()) {

            if (rev.liked_users.some((user) => user.user_id.toString() === req.user._id.toString())) {
                rev.liked_users = rev.liked_users.filter((user) => user.user_id.toString() !== req.user._id.toString());
                rev.likes = rev.liked_users.length;
                liked = true;
                return rev;
            }
            else {

                rev.disliked_users = rev.disliked_users.filter((user) => user.user_id.toString() !== req.user._id.toString());

                rev.liked_users.push({ user_id: req.user._id });
                rev.likes = rev.liked_users.length;
                rev.dislikes = rev.disliked_users.length;
                return rev;
            }

        }
        return rev;
    })


    await prodReview.save({ validateBeforeSave: false });

    if (!liked) {
        return res.json({
            success: true,
            message: "Successfully liked review",
        })
    }
    else {
        return res.json({
            success: true,
            message: "Successfully removed your like!"
        })
    }
});



export const toggleDislikeOfAReview = catchAsync(async (req, res, next) => {

    const { reviews, review } = req.body;

    const prodReview = await Review.findById(reviews);
    if (!prodReview) {
        return next(new ErrorHandler("Reviews not found!", 404));
    }

    if (!prodReview.reviews) {
        return next(new ErrorHandler("This product has not been reviewed yet!", 400));
    }

    if (!prodReview.reviews.some((rev) => (rev._id.toString() === review.toString()))) {
        return next(new ErrorHandler("Review not found!", 404));
    }

    let disliked = false;
    prodReview.reviews = prodReview.reviews.map((rev) => {
        if (rev._id.toString() === review.toString()) {

            if (rev.disliked_users.some((user) => user.user_id.toString() === req.user._id.toString())) {
                rev.disliked_users = rev.disliked_users.filter((user) => { user.user_id.toString() !== req.user._id.toString() });
                rev.dislikes = rev.disliked_users.length;
                disliked = true;
                return rev;
            }
            else {
                rev.liked_users = rev.liked_users.filter((user) => user.user_id.toString() !== req.user._id.toString());

                rev.disliked_users.push({ user_id: req.user._id });
                rev.dislikes = rev.disliked_users.length;
                rev.likes = rev.liked_users.length;
                return rev;
            }
        }
        return rev;
    })

    await prodReview.save({ validateBeforeSave: false });

    if (!disliked) {
        return res.json({
            success: true,
            message: "Successfully disliked review!",
        })
    }
    else {
        return res.json({
            success: true,
            message: "Successfully removed your dislike!"
        })
    }
});



export const toggleWishlistProduct = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product doesn't exist!", 404));
    }

    const user = await Users.findById(req.user._id);
    if (!user) {
        return next(new ErrorHandler("User doesn't exist, please try again!", 404));
    }

    if (user.wishlist_items.some((prod) => prod.toString() === product._id.toString())) {
        user.wishlist_items = user.wishlist_items.filter((prod) => prod.toString() !== product._id.toString());

        await user.save({ validateBeforeSave: false });

        return res.json({
            success: true,
            message: "Successfully removed the product from wishlist!",
        })
    }

    user.wishlist_items.push(product._id);

    await user.save({ validateBeforeSave: false });

    return res.json({
        success: true,
        message: "Successfully added the product to wishlist!",
    });
});