import { Router } from "express";
import { createUser, deleteAllUsers, deleteUser, getAllUsers, getUserDetails, loginUser, logoutUser, updateUserDetails } from "../controllers/userControllers.js";
import { isUserAuthenticated } from "../middleware/isUserAuthenticated.js";

const router = Router();

// Admin routes
router.route("/users").get(getAllUsers);

router.route("/users/deleteall").delete(deleteAllUsers);


// User routes
router.route("/createuser").post(createUser);

router.route("/user/getuser").get(isUserAuthenticated, getUserDetails);

router.route('/login').post(loginUser)

router.route('/user/updateuser').put(isUserAuthenticated, updateUserDetails);

router.route('/user/deleteuser').delete(isUserAuthenticated, deleteUser)

router.route('/user/logout').get(isUserAuthenticated, logoutUser);

export default router;