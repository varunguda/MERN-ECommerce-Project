import { combineReducers } from "redux";
import { productReducer, productDetailsReducer, sellerProductsReducer } from "./ProductReducer";


const reducers = combineReducers({
    products: productReducer,
    detailedProducts: productDetailsReducer,
    sellerProducts: sellerProductsReducer,
});


export default reducers;