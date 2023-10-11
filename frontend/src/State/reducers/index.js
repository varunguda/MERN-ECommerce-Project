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
import { 
    checkUserReducer,
    forgotPasswordReducer,
    loginReducer,
    resetPasswordReducer,
    signOutReducer,
    signupReducer,
    verifcationReducer
} from "./UserReducers";
import {
    getAddressesReducer,
    addAddressReducer,
    updateDeleteAddressReducer,
} from "./ProfileReducers"
import { loaderReducer } from "./LoaderReducers";


const reducers = combineReducers({
    products: productReducer,
    detailedProducts: productDetailsReducer,
    sellerProducts: sellerProductsReducer,
    modal: modalReducer,
    bundleProducts: bundleProductsReducer,
    productReviews: productReviewReducer,
    urlParams: navigationReducer,
    checkUser: checkUserReducer,
    loggedIn: loginReducer,
    signup: signupReducer,
    signout: signOutReducer,
    verifySignup: verifcationReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer,
    loader: loaderReducer,
    addresses: getAddressesReducer,
    addAddress: addAddressReducer,
    updateDeleteAddress: updateDeleteAddressReducer
});


export default reducers;