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


export default router;