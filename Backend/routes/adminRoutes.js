import { Router } from "express";
import { isAdmin } from "../middleware/isAdminAuthenticated.js";
import {
    getAllSellersAndBuyers,
    updateUserRole
} from "../controllers/adminControllers.js";


const router = Router();

// ADMIN ROUTES
router.route("/admin/users/getall").get( isAdmin ,getAllSellersAndBuyers);

router.route("/admin/updateuser/:id").put(isAdmin, updateUserRole )


export default router
