import { combineReducers } from "redux";
import { productReducer, productDetailsReducer } from "./ProductReducer";


const reducers = combineReducers({
    products: productReducer,
    detailedProducts: productDetailsReducer,
});


export default reducers;