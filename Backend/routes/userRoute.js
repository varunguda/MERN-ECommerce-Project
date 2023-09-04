import { Router } from "express";
import { createUser, deleteUser, forgotPassword, getUserDetails, loginUser, logoutUser, updateUserDetails } from "../controllers/userControllers.js";
import { isUserAuthenticated } from "../middleware/isUserAuthenticated.js";


const router = Router();


// USER ROUTES
router.route("/createuser").post(createUser);

router.route('/login').post(loginUser)

router.route("/user/getuser").get(isUserAuthenticated, getUserDetails);

router.route('/user/updateuser').put(isUserAuthenticated, updateUserDetails);

router.route('/user/deleteuser').delete(isUserAuthenticated, deleteUser)

router.route('/user/logout').get(isUserAuthenticated, logoutUser);

router.route('/user/forgotpassword').post(forgotPassword)

export default router;