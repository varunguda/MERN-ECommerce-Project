import { Router } from "express";
import { isAdmin } from "../middleware/isAdminAuthenticated.js";
import { isUserAuthenticated } from "../middleware/isUserAuthenticated.js"
import { isAdminOrSeller } from "../middleware/isAdminOrSeller.js";
import { isSeller } from "../middleware/isSellerAuthenticated.js";
import {
    craeateProductReview,
    createProduct,
    deleteAnyProduct,
    deleteMyProduct,
    deleteReview,
    getAllProductReviews,
    getAllProducts,
    getMyProducts,
    getProductDetails,
    updateAnyProduct,
    updateMyProduct
} from "../controllers/productController.js";


const router = Router();


// All
router.route('/products').get(getAllProducts);

router.route('/products/addreview/:id').post(isUserAuthenticated, craeateProductReview);

router.route('/products/reviews/:id').get(getAllProductReviews);

router.route('/products/deletereview/:id').delete(isUserAuthenticated, deleteReview);

router.route('/products/:id').get(getProductDetails);



// Admin
router.route('/admin/products/:id')
    .put( isAdmin, updateAnyProduct)
    .delete( isAdmin ,deleteAnyProduct)



// Seller
router.route("/seller/myproducts/:id")
    .put(isSeller, updateMyProduct )
    .delete(isSeller, deleteMyProduct)



// Admin & Seller
router.route("/myproducts").get(isAdminOrSeller, getMyProducts)

router.route('/myproducts/addnew').post(isAdminOrSeller, createProduct)


export default router;