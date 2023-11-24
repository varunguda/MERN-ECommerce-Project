import { body } from "express-validator";
import { orderStatuses } from "../models/orderModel.js";


export const statusValidator = [
    body("status")
        .exists().withMessage("Order status is required!")
        .bail()
        .custom(status => {
            if (!orderStatuses.includes(status)) {
                throw new Error("Please provide a valid status name")
            }
            else {
                return true;
            }
        })
];


export const justificationValidator = [
    body("justification")
        .exists().withMessage("Please provide buyer(s) with a Justification for the inconvenience that they are experiencing due to your actions.")
        .isLength({ min: 10, max: 400 }).withMessage("The Justification provided must contain atleast 10 characters and atmost 400 characters!"),
];