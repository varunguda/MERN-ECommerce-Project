import { Router } from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import { isUser } from "../middleware/isUser.js"
import { isAdminOrSeller } from "../middleware/isAdminOrSeller.js";
import { isSeller } from "../middleware/isSeller.js";
import {
    addBundle,
    addOptions,
    craeateProductReview,
    createProduct,
    deleteAnyProduct,
    deleteMyProduct,
    deleteReview,
    getAllBundleProducts,
    getAllProductReviews,
    getAllProducts,
    getMyProducts,
    getProductDetails,
    getProductsOfSeller,
    getSingleProductDetails,
    toggleDislikeOfAReview,
    toggleLikeOfAReview,
    updateAnyProduct,
    updateMyProduct
} from "../controllers/productController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";


const router = Router();


// All
router.route('/products').get(getAllProducts);

router.route('/products/addreview/:id').post(isUser, craeateProductReview);

router.route('/products/reviews/like').post(isUser, toggleLikeOfAReview);

router.route('/products/reviews/dislike').post(isUser, toggleDislikeOfAReview);

router.route('/products/reviews/:id').get(isLoggedIn, getAllProductReviews);

router.route('/products/reviews/:id').delete(isUser, deleteReview);

router.route('/products/:id').get(getProductDetails);

router.route('/product/:id').get(getSingleProductDetails);

router.route("/products/seller/:id").get(getProductsOfSeller);

router.route("/products/bundles/:id").get(getAllBundleProducts);


// Admin
router.route('/admin/products/:id')
    .put(isAdmin, updateAnyProduct)
    .delete(isAdmin ,deleteAnyProduct);


// Seller
router.route("/seller/myproducts/bundles/:id").post(isSeller, addBundle);

router.route("/seller/myproducts/options/:id").post(isSeller, addOptions);

router.route("/seller/myproducts/:id")
    .put(isSeller, updateMyProduct)
    .delete(isSeller, deleteMyProduct);


// Admin & Seller
router.route("/myproducts")
    .get(isAdminOrSeller, getMyProducts)
    .post(isAdminOrSeller, createProduct)


export default router;