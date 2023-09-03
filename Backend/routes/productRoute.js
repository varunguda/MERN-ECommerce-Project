import { Router } from "express";
import { createProduct, deleteAllProducts, deleteProduct, getAllProducts, getProductDetails, updateProduct } from "../controllers/productController.js";

const router = Router();

// Get all products - All
router.route('/products').get(getAllProducts)

// Create a product - Admin & Seller
router.route('/product/addnew').post(createProduct)

// Update & delete & get product - Admin & Seller
router
    .route('/product/:id')
    .put(updateProduct)
    .delete(deleteProduct)
    .get(getProductDetails)

// Delete all products - Admin
router.route('/products/deleteall').delete(deleteAllProducts)


export default router;