import { combineReducers } from "redux";
import {
    productReducer,
    productDetailsReducer,
    sellerProductsReducer,
    bundleProductsReducer,
    productReviewReducer
} from "./ProductReducer";
import { modalReducer } from "./ModalReducers";
import { navigationReducer } from "./NavigationReducers";
import { checkUserReducer, forgotPasswordReducer, loginReducer, resetPasswordReducer, signupReducer, verifcationReducer } from "./UserReducers";


const reducers = combineReducers({
    products: productReducer,
    detailedProducts: productDetailsReducer,
    sellerProducts: sellerProductsReducer,
    modal: modalReducer,
    bundleProducts: bundleProductsReducer,
    productReviews: productReviewReducer,
    urlParams: navigationReducer,
    checkUser: checkUserReducer,
    login: loginReducer,
    signup: signupReducer,
    verifySignup: verifcationReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer,
});


export default reducers;