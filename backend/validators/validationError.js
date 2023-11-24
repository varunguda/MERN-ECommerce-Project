import { validationResult } from "express-validator";
import { ErrorHandler } from "../utils/errorHandler.js";


export const validationError = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ErrorHandler(errors.array().map((err) => err.msg).join(", "), 400);
    }
}