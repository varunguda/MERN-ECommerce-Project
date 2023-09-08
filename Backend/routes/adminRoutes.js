import { Router } from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import {
    deleteAnyUser,
    getAllSellersAndBuyers,
    getAnyUserDetails,
    updateUserRole
} from "../controllers/adminControllers.js";


const router = Router();

// ADMIN ROUTES
router.route("/admin/users/all").get( isAdmin ,getAllSellersAndBuyers);

router.route("/admin/user/:id")
    .get(isAdmin, getAnyUserDetails)
    .put(isAdmin, updateUserRole)
    .delete(isAdmin, deleteAnyUser)


export default router
