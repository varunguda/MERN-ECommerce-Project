import { Products } from '../models/productModel.js'
import { ErrorHandler } from '../utils/errorHandler.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllProducts = catchAsync(async (req, res, next) =>{
    const products = await Products.find({});
    return res.json({
        success: true,
        products
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
    
    await Products.create(req.body);
    
    return res.status(201).json({
        success: true,
        message: "Product added successfully!"
    })

})



export const updateProduct = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const product = await Products.findById(id);
    if(!product){
        return next(new ErrorHandler("Product not found!", 400));
    }

    await Products.findByIdAndUpdate(id, req.body);

    return res.json({
        success: true,
        message: "Product updated successfully!"
    })
})



export const deleteProduct = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    const product = await Products.findById(id);

    if(!product){
        return next(new ErrorHandler("Product not found!", 400));
    }

    await Products.findByIdAndDelete(id);

    return res.json({
        success: true,
        message: "Product has been deleted successfully!"
    })
})



export const deleteAllProducts = catchAsync(async (req, res, next) => {
    await Products.deleteMany({});
    res.json({
        success: true,
        message: "Successfully deleted all the Products"
    })
})