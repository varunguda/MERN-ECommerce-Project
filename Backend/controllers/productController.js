import { Products } from '../models/productModel.js'


export const getAllProducts = (req, res, next) =>{
    return res.json({
        success: true,
        message: "Welcome to Backend!"
    })
}



export const createProduct = async (req, res, next) => {
    
    const product = await Products.create({ })
}
