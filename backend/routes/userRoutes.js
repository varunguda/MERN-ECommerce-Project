import { Router } from "express";
import { isUser } from "../middleware/isUser.js";
import {
    addUserAddress,
    checkUser,
    createUser,
    createVerifiedUser,
    deleteUser,
    deleteUserAddress,
    forgotPassword,
    getAllAddresses,
    getUserDetails,
    loginUser,
    logoutUser,
    recoverPassword,
    updateAddress,
    updateUserDetails,
    validateMobileNumber,
    verifyMobileNumberOtp
} from "../controllers/userControllers.js";
import { toggleWishlistProduct } from "../controllers/productController.js";


const router = Router();


// USER ROUTES

router.route("/checkuser").post(checkUser);

router.route("/register").post(createUser);

router.route("/register-verify").post(createVerifiedUser);

router.route('/password/forgot').post(forgotPassword);

router.route("/password/reset/:resetToken").put(recoverPassword);

router.route('/login').post(loginUser);

router.route("/me").get(isUser, getUserDetails);

router.route('/me/update').put(isUser, updateUserDetails);

router.route('/me/phone/verify').post(isUser, verifyMobileNumberOtp);

router.route('/me/phone').post(isUser, validateMobileNumber);

router.route('/me/delete').delete(isUser, deleteUser);

router.route('/me/list/:id').get(isUser, toggleWishlistProduct);

router.route("/me/list").get(isUser, (req, res, next) => {
    return res.json({
        success: true,
        list_items: req.user.wishlist_items
    })
});

router.route('/logout').get(isUser, logoutUser);

router.route("/me/address/:addressId?")
    .put(isUser, updateAddress)
    .delete(isUser, deleteUserAddress)
    .post(isUser, addUserAddress)
    .get(isUser, getAllAddresses);




export default router;