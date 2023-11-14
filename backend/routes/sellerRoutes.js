import { Router } from "express";
import { isSeller } from "../middleware/isSeller.js";
import { sellerDataAnalysis } from "../controllers/sellerControllers.js";


const router = Router();

// SELLER ROUTES

router.route("/seller").get(isSeller, (req, res) => {
    return res.json({
        success: true,
        seller: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            is_seller: req.user.is_seller,
            is_admin: req.user.is_admin,
        }
    });
});


router.route("/seller/analysis").get(isSeller, sellerDataAnalysis);

// router.route("/admin/users/customers").get( isAdmin, getAllCustomers);

// router.route("/admin/users/sellers").get( isAdmin, getAllSellers);

// router.route("/admin/user/:id")
//     .get(isAdmin, getAnyUserDetails)
//     .put(isAdmin, updateUserRole)
//     .delete(isAdmin, deleteAnyUser)

// router.route("/admin/seller/merit/:id").put(isAdmin, setSellerMerit);


export default router;