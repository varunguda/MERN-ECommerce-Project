import { body } from "express-validator";


export const userRoleValidator = [
    body("is_admin")
        .isBoolean().withMessage("Please provide a boolean value for is_admin"),

    body("is_seller")
        .isBoolean().withMessage("Please provide a boolean value for is_seller")
]