import { Router } from "express";
import { createUser, createVerifiedUser, deleteUser, forgotPassword, getUserDetails, loginUser, logoutUser, recoverPassword, updateUserDetails } from "../controllers/userControllers.js";
import { isUserAuthenticated } from "../middleware/isUserAuthenticated.js";
import { verifyMail } from "../utils/verifyMail.js";

const router = Router();


// USER ROUTES
router.route("/createuser").post(createUser);

router.route("/createuser/user-verification").post(createVerifiedUser);

router.route('/login').post(loginUser)

router.route("/user/getuser").get(isUserAuthenticated, getUserDetails);

router.route('/user/updateuser').put(isUserAuthenticated, updateUserDetails);

router.route('/user/deleteuser').delete(isUserAuthenticated, deleteUser)

router.route('/user/logout').get(isUserAuthenticated, logoutUser);

router.route('/user/forgotpassword').post(forgotPassword);

router.route("/password/reset/:resetToken").put(recoverPassword)

export default router;