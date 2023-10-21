import { Router } from "express";
import { stripePayment } from "../controllers/paymentControllers.js";
import { isUser } from "../middleware/isUser";

const router = Router();

router.route("/payment").post(isUser, stripePayment);

export default router;