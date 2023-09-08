import { Router } from "express";
import { isUser } from "../middleware/isUser.js";
import {
    createUser,
    createVerifiedUser,
    deleteUser,
    forgotPassword,
    getUserDetails,
    loginUser,
    logoutUser,
    recoverPassword,
    updateUserDetails
} from "../controllers/userControllers.js";


const router = Router();


// USER ROUTES
router.route("/register").post(createUser);

router.route("/register-verify").post(createVerifiedUser);

router.route('/login').post(loginUser)

router.route("/me").get(isUser, getUserDetails);

router.route('/me/update').put(isUser, updateUserDetails);

router.route('/me/delete').delete(isUser, deleteUser)

router.route('/logout').get(isUser, logoutUser);

router.route('/password/forgot').post(forgotPassword);

router.route("/password/reset/:resetToken").put(recoverPassword)

export default router;