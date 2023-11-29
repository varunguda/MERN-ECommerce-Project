import { body } from "express-validator";
import { nameValidator } from "./userValidation.js";


export const productValidator = (field) => {

    return [
        body(field ? `${field}.name` : 'name')
            .exists().withMessage("Product name is required!")
            .bail()
            .isLength({ min: 10, max: 250 }).withMessage("Product name must contain atleast 10 or atmost 250 characters!"),

        body(field ? `${field}.description` : 'description')
            .exists().withMessage("Product description is required!")
            .bail()
            .isLength({ min: 10, max: 1000 }).withMessage("Product description must contain atleast 10 or atmost 1000 characters!"),

        body(field ? `${field}.stock` : 'stock')
            .exists().withMessage("Product stock is required!")
            .bail()
            .isNumeric().withMessage("Product stock must be a number")
            .bail()
            .isFloat({ min: 10, max: 999999 }).withMessage("Product stock must be in range 10 and 999999!"),

        body(field ? `${field}.price` : 'price')
            .exists().withMessage("Product price is required!")
            .bail()
            .isNumeric().withMessage("Product price must be a number")
            .bail()
            .isFloat({ min: 10, max: 999999 }).withMessage("Product proce must be in range 10 and 999999!"),

        body(field ? `${field}.discount_percent` : 'discount_percent')
            .optional()
            .isNumeric().withMessage("Product discount percent must be a numeric value!")
            .bail()
            .isFloat({ min: 0, max: 90 }).withMessage("Product discount percent must be in range 1 to 90."),

        body(field ? `${field}.color` : 'color')
            .optional()
            .isLength({ min: 2, max: 40 }).withMessage("Color must contain atleast 2 and atmost 40 characters."),

        body(field ? `${field}.ram` : 'ram')
            .optional()
            .isNumeric().withMessage("Ram must be a numeric value, units: GB")
            .isFloat({ min: 1, max: 9999 }).withMessage("Ram must be in range 1 to 9999"),

        body(field ? `${field}.storage` : 'storage')
            .optional()
            .isNumeric().withMessage("Storage must be a numeric value, units: GB")
            .isFloat({ min: 1, max: 9999 }).withMessage("Storage must be in range 1 to 9999"),

        body(field ? `${field}.quantity` : 'quantity')
            .optional()
            .isNumeric().withMessage("Quantity must be a numeric value, units: ml")
            .isFloat({ min: 1, max: 9999 }).withMessage("Quantity must be in range 1 to 9999"),

        body(field ? `${field}.size` : 'size')
            .optional()
            .isLength({ min: 1, max: 10 }).withMessage("Size must contain atleast 1 and atmost 10 characters."),

        body(field ? `${field}.processor` : 'processor')
            .optional()
            .isLength({ min: 5, max: 100 }).withMessage("Processor must contain atleast 5 and atmost 100 characters."),

        body(field ? `${field}.resolution` : 'resolution')
            .optional()
            .isLength({ min: 3, max: 10 }).withMessage("Resolution must contain atleast 3 and atmost 10 characters.")
            .bail()
            .custom(val => {
                const resRegex = /\b\d+x\d+\b/;
                if(!resRegex.test(val)){
                    throw new Error("Invalid Resolution format! Here's a valid resolution format, eg: 1920x1080")
                }
                else{
                    return true;
                }
            }),

        body(field ? `${field}.images` : 'images')
            .exists().withMessage("Seems like you haven't provided image for a product")
    ]
}


export const createProductValidator = [

    nameValidator("brand", 2, 50),

    body("variations")
        .exists().withMessage("Please provide product variations")
        .isArray().withMessage("Invalid variations format! Variations must be an array."),

    body("products")
        .exists().withMessage("Please provide products")
        .isArray().withMessage('Invalid products format! Products must be an array.'),

    ...productValidator("products.*")
];


export const reviewValidator = [

    body("title")
        .exists().withMessage("Review title is required!")
        .bail()
        .isLength({ min: 1, max: 50 }).withMessage("Review title must contain atleast 1 and atmost 50 characters"),


    body("comment")
        .exists().withMessage("Review comment is required!")
        .bail()
        .isLength({ min: 5, max: 600 }).withMessage("Review comment must contain atleast 5 and atmost 600 characters!"),


    body("rating")
        .exists().withMessage("Please provide your produt rating!")
        .bail()
        .isNumeric().withMessage("Product rating must be a numeric value.")
        .bail()
        .isFloat({ min: 1, max: 5 }).withMessage("Product rating must be in range 1 to 5.")

]