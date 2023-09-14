import { combineReducers } from "redux";
import { productReducer } from "./ProductReducer";


const reducers = combineReducers({
    products: productReducer,
});


export default reducers;