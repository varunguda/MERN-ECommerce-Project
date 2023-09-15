
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_FAILURE,
    ALL_PRODUCT_SUCCESS,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_FAILURE,
    PRODUCT_DETAILS_SUCCESS,

    CLEAR_ERRORS,
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



export const productDetailsReducer = ( state = { products: [] }, action ) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:{
            return({
                loading: true,
                products: []
            });
        }

        case PRODUCT_DETAILS_SUCCESS:{
            return({
                loading: false,
                products: action.payload.products,
            })
        }

        case PRODUCT_DETAILS_FAILURE:{
            return({
                loading: false,
                error: action.payload,
            })
        }

        case CLEAR_ERRORS:{
            return({
                loading: false,
                error: null,
            })
        }
    
        default:{
            return state
        }
    }
}