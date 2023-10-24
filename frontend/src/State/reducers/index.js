import { combineReducers } from "redux";
import {
    productReducer,
    productDetailsReducer,
    sellerProductsReducer,
    bundleProductsReducer,
    productReviewReducer
} from "./ProductReducer";
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
    getMyOrdersReducer,
    cancelMyOrderReducer,
} from "./ProfileReducers"
import { loaderReducer } from "./LoaderReducers";
import { addToCartReducer, orderValueReducer } from "./CartReducers";


const reducers = combineReducers({
    products: productReducer,
    detailedProducts: productDetailsReducer,
    sellerProducts: sellerProductsReducer,
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
    updateDeleteAddress: updateDeleteAddressReducer,
    myOrders: getMyOrdersReducer,
    cancelMyOrder: cancelMyOrderReducer,
    cart: addToCartReducer,
    orderValue: orderValueReducer,
});


export default reducers;