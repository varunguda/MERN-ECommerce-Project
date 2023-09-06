import { Products } from '../models/productModel.js'
import { ErrorHandler } from '../utils/errorHandler.js';
import catchAsync from '../utils/catchAsync.js';
import { ApiFeatures } from '../utils/apiFeatures.js';



export const getAllProducts = catchAsync(async (req, res, next) =>{

    const productCount = await Products.countDocuments()
    const apiFeatures = new ApiFeatures(Products.find(), req.query).search().filter().pagination(10)
    const products = await apiFeatures.products;
    return res.json({
        success: true,
        products,
        product_count: productCount,
    })
})



export const getProductDetails = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    const product = await Products.findById(id);
    if(!product){
        return next(new ErrorHandler("Product not found!", 400));
    }
    return res.json({
        success: true,
        product
    })
})



export const createProduct = catchAsync(async (req, res, next) => {

    await Products.create({...req.body, seller_id: req.user._id});
    
    return res.status(201).json({
        success: true,
        message: "Product added successfully!"
    })

})



export const updateAnyProduct = catchAsync( async(req, res, next) => {

    const { id } = req.params;

    const product =  await Products.findByIdAndUpdate(id, req.body);
    if(!product){
        return next(new ErrorHandler("Product not found!", 400));
    }

    return res.json({
        success: true,
        message: "Product updated successfully!"
    })
})



export const deleteAnyProduct = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    const product = await Products.findByIdAndDelete(id);
    if(!product){
        return next(new ErrorHandler("Product not found!", 400));
    }

    return res.json({
        success: true,
        message: "Product has been deleted successfully!"
    })
})



export const getMyProducts = catchAsync( async(req, res, next) => {
    
    const apiFeatures  = new ApiFeatures(Products.find({ seller_id: req.user._id }), req.query ).search().pagination(10);

    const products = await apiFeatures.products;

    const product_count = products.length

    return res.json({
        success: true,
        products,
        product_count
    })
})



export const updateMyProduct = catchAsync( async(req, res, next) => {
    const { id } = req.params;

    const product = await Products.findOneAndUpdate({ _id: id, seller_id: req.user._id }, { ...req.body })

    if(!product){
        return next(new ErrorHandler("Product not found!", 404));
    }

    return res.json({
        success: true,
        message: "Product details updated successfully!"
    })
})



export const deleteMyProduct = catchAsync( async(req, res, next) => {
    const { id } = req.params;

    const product = await Products.findOneAndDelete({ _id:id, seller_id: req.user._id })
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    return res.json({
        success: true,
        message: "Successfully deleted your product!"
    })
})