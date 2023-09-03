import { Router } from "express";
import { createProduct, getAllProducts } from "../controllers/productController.js";

const router = Router();

// Get all products - All
router.route('/products').get(getAllProducts)

// Create a product - Admin & Seller
router.route('/product/addnew').post(createProduct)

export default router;