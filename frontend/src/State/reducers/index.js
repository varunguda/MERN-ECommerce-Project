import { combineReducers } from "redux";
import { productReducer, productDetailsReducer, sellerProductsReducer, bundleProductsReducer, productReviewReducer } from "./ProductReducer";
import { modalReducer } from "./ModalReducers";


const reducers = combineReducers({
    products: productReducer,
    detailedProducts: productDetailsReducer,
    sellerProducts: sellerProductsReducer,
    modal: modalReducer,
    bundleProducts: bundleProductsReducer,
    productReviews: productReviewReducer,
});


export default reducers;