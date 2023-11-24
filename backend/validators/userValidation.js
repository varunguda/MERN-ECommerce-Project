import { body } from "express-validator";


export const nameValidator = (field, min, max) => {

    let updatedField = (field.toString().charAt(0).toLocaleUpperCase() + field.toString().slice(1)).replace("_", " ");

    return (
        body(field)
            .exists().withMessage(`Please provide your ${updatedField}`)
            .bail()
            .isLength({ min, max }).withMessage(`${updatedField} must contain atleast ${min} and atmost ${max} alphabet characters!`)
            .bail()
            .custom((name) => {
                const calculateLengthWithoutNumerics = (str) => {
                    let count = 0;
                    for (let i = 0; i < str.length; i++) {
                        if (!isNaN(parseInt(str[i]))) {
                            continue;
                        }
                        count++;
                    }
                    return count;
                }
                const nameAlpCount = calculateLengthWithoutNumerics(name);
                if (nameAlpCount < min || nameAlpCount > max) {
                    throw new Error(`${updatedField} must contain atleast ${min} and atmost ${max} alphabet characters!`)
                }
                else {
                    return true;
                }
            })
    );
};


export const emailValidator = [
    body("email")
        .exists().withMessage("Please provide your Email address!")
        .bail()
        .isEmail().withMessage("Invalid Email format!")
];


export const phoneNumberValidator = [
    body("phone_num")
        .exists().withMessage("Please provide a mobile number!")
        .bail()
        .isMobilePhone("en-IN").withMessage("Please provide a valid mobile number!")
];


export const passwordValidator = (field) => {

    return (
        body(field)
            .exists().withMessage(`Please provide ${field}`)
            .bail()
            .isLength({ min: 8, max: 100 }).withMessage("A password must contain atleast 8 and atmost 100 characters!")
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 0,
                minSymbols: 0,
            }).withMessage("Password must contain atlest 1 LowerCase and 1 UpperCase Alphabet")
            .custom(value => {
                if (value.match(/\d/) || value.match(/[^a-zA-Z0-9\s]/)) {
                    return true;
                }
                throw new Error('Password must contain atleast one number or one symbol');
            })
    )
};


export const addAddressValidator = [

    nameValidator("first_name", 3, 16),

    nameValidator("last_name", 2, 16),

    body("flat")
        .exists().withMessage("Please provide your Flat details")
        .bail()
        .isLength({ min: 5, max: 90 }).withMessage("Flat details must be in range 5 and 90 characters!"),


    body("street_address")
        .exists().withMessage("Please provide your Street address")
        .bail()
        .isLength({ min: 5, max: 90 }).withMessage("Street details must be in range 5 and 90 characters!"),


    body("landmark")
        .optional()
        .isLength({ max: 20 }).withMessage("Landmark is too large!"),


    body("zip", "Please provide a valid Zip code!")
        .exists().withMessage("Please provide your Zip code")
        .bail()
        .isPostalCode("IN"),


    body("mobile", "Invalid Mobile number!")
        .exists().withMessage("Please provide your Mobile number")
        .bail()
        .isMobilePhone("en-IN"),


    body("delivery_notes")
        .optional()
        .isLength({ max: 250 }).withMessage("Delivery notes is too large!"),


    body("default_address", "Please provide a boolean value for default address")
        .optional()
        .isBoolean()
];


export const updateAddressValidator = [

    body("first_name")
        .optional()
        .isLength({ min: 3, max: 16 }).withMessage("First name must contain atleast 3 and atmost 16 characters!")
        .custom((name) => {
            const calculateLengthWithoutNumerics = (str) => {
                let count = 0;
                for (let i = 0; i < str.length; i++) {
                    if (!isNaN(parseInt(str[i]))) {
                        continue;
                    }
                    count++;
                }
                return count;
            }
            const nameAlpCount = calculateLengthWithoutNumerics(name);
            if (nameAlpCount < 3 || nameAlpCount > 16) {
                throw new Error("First name must contain atleast 3 and atmost 16 alphabet characters!")
            }
            else {
                return true;
            }
        }),


    body("last_name")
        .optional()
        .isLength({ min: 2, max: 16 }).withMessage("Last name must contain atleast 2 and at most 16 characters!")
        .custom((name) => {
            const calculateLengthWithoutNumerics = (str) => {
                let count = 0;
                for (let i = 0; i < str.length; i++) {
                    if (!isNaN(parseInt(str[i]))) {
                        continue;
                    }
                    count++;
                }
                return count;
            }
            const nameAlpCount = calculateLengthWithoutNumerics(name);
            if (nameAlpCount < 2 || nameAlpCount > 16) {
                throw new Error("Last name must contain atleast 2 and at most 16 alphabet characters!")
            }
            else {
                return true;
            }
        }),


    body("flat")
        .optional()
        .isLength({ min: 5, max: 90 }).withMessage("Flat details must be in range 5 and 90 characters!"),


    body("street_address")
        .optional()
        .isLength({ min: 5, max: 90 }).withMessage("Street details must be in range 5 and 90 characters!"),


    body("landmark")
        .optional()
        .isLength({ max: 20 }).withMessage("Landmark is too large!"),


    body("zip", "Please provide a valid Zip code!")
        .isPostalCode("IN"),


    body("mobile", "Invalid Mobile number!")
        .isMobilePhone("en-IN"),


    body("delivery_notes")
        .isLength({ max: 250 }).withMessage("Delivery notes is too large!"),


    body("default_address", "Please provide a boolean value for default address")
        .isBoolean()
];
