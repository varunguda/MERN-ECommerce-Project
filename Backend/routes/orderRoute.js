import { Router } from "express";
import { isUserAuthenticated } from "../middleware/isUserAuthenticated.js";
import { isAdmin } from "../middleware/isAdminAuthenticated.js";
import { isSeller } from "../middleware/isSellerAuthenticated.js";
import { isAdminOrSeller } from "../middleware/isAdminOrSeller.js"
import {
    cancelOrderOfMyProduct,
    deleteAnyOrder,
    deleteMyOrder,
    getAllOrders,
    getMyOrders,
    getMyProductsOrders,
    getOrderDetails,
    placeNewOrder,
    updateAnyOrderStatus
} from "../controllers/orderControllers.js";


const router = Router();


// All
router.route("/order/placeneworder").post(isUserAuthenticated, placeNewOrder);

router.route("/myorders").get(isUserAuthenticated, getMyOrders);

router.route("/myorders/:id").get(isUserAuthenticated, getOrderDetails);

router.route("/myorders/:id").delete(isUserAuthenticated, deleteMyOrder )



// Admin
router.route("/orders/all").get(isAdmin, getAllOrders);

router.route("/orders/all/:id").delete(isAdmin, deleteAnyOrder );

router.route("/orders/all/:id").put(isAdmin, updateAnyOrderStatus );


// Seller
router.route("/myproducts/orders/:id").delete(isSeller, cancelOrderOfMyProduct )


// Admin & Seller
router.route('/myproducts/orders').get(isAdminOrSeller, getMyProductsOrders);


export default router;