
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_FAILURE,
    ALL_PRODUCT_SUCCESS,
    CLEAR_ERRORS
} from "../constants/ProductConstants.js";

export const productReducer = ( state = { products: [] }, action ) => {
    
    switch(action.type){

        case ALL_PRODUCT_REQUEST:{
            return({
                loading: true,
                products: [],
            });
        }

        case ALL_PRODUCT_SUCCESS:{
            return({
                loading: false,
                products: action.payload.products,
                productCount: action.payload.productCount,
            })
        }

        case ALL_PRODUCT_FAILURE:{
            return({
                loading: false,
                error: action.payload,
            })
        }

        case CLEAR_ERRORS:{
            return({
                ...state,
                error: null
            });
        }

        default:{
            return state;
        }
    }
}