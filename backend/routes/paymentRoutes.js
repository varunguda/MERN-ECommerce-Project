import { Router } from "express";
import { isUser } from "../middleware/isUser.js";
import { stripePayment } from "../controllers/paymentControllers.js";

const router = Router();


router.route("/order/payment").post( isUser, stripePayment);


export default router
