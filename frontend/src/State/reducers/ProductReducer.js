
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_FAILURE,
    ALL_PRODUCT_SUCCESS,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_FAILURE,
    PRODUCT_DETAILS_SUCCESS,

    SELLER_PRODUCT_FAILURE,
    SELLER_PRODUCT_REQUEST,
    SELLER_PRODUCT_SUCCESS,

    BUNDLE_PRODUCTS_FAILURE,
    BUNDLE_PRODUCTS_REQUEST,
    BUNDLE_PRODUCTS_SUCCESS,

    PRODUCT_REVIEWS_FAILURE,
    PRODUCT_REVIEWS_SUCCESS,
    PRODUCT_REVIEWS_REQUEST,

    ADD_PRODUCT_REVIEW_REQUEST,
    ADD_PRODUCT_REVIEW_SUCCESS,
    ADD_PRODUCT_REVIEW_FAILURE,

    DELETE_PRODUCT_REVIEW_REQUEST,
    DELETE_PRODUCT_REVIEW_SUCCESS,
    DELETE_PRODUCT_REVIEW_FAILURE

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
                productCount: action.payload.product_count,
                productsMaxPrice: action.payload.max_price,
                productsMinPrice: action.payload.min_price,
                productsExist: action.payload.exist,
                productsBrands: action.payload.brands,
                allCategories: action.payload.categories,
                productsFilters: action.payload.filters,
                productsRatings: action.payload.customer_ratings
            })
        }

        case ALL_PRODUCT_FAILURE:{
            return({
                loading: false,
                error: action.payload,
            })
        }

        default:{
            return state;
        }
    }
}



export const productDetailsReducer = ( state = { product: {} }, action ) => {

    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:{
            return({
                ...state,
                loading: true,
            });
        }

        case PRODUCT_DETAILS_SUCCESS:{
            return({
                loading: false,
                product: action.payload.product,
                variation_products: action.payload.variation_products,
            })
        }

        case PRODUCT_DETAILS_FAILURE:{
            return({
                loading: false,
                error: action.payload,
            })
        }
    
        default:{
            return state
        }
    }
}



export const sellerProductsReducer = ( state = [], action ) => {
    switch (action.type) {
        case SELLER_PRODUCT_REQUEST:{
            return({
                sellersProductsLoading: true,
                sellersProducts: []
            })
        }

        case SELLER_PRODUCT_SUCCESS:{
            return({
                sellersProductsLoading: false,
                sellersProducts: action.payload,
            })
        }

        case SELLER_PRODUCT_FAILURE:{
            return({
                sellersProductsLoading: false,
                sellersProductsError: action.payload,
            })
        }
        
        default:{
            return state;
        }
    }
}



export const bundleProductsReducer = ( state = {}, action ) => {

    switch (action.type) {
        case BUNDLE_PRODUCTS_REQUEST:{
            return({
                bundleLoading: true,
                bundles: []
            })
        }

        case BUNDLE_PRODUCTS_FAILURE:{
            return({
                bundleLoading: false,
                bundlesError: action.payload,
            })
        }

        case BUNDLE_PRODUCTS_SUCCESS: {
            return({
                bundleLoading: false,
                bundles: action.payload.bundles,
            })
        }
    
        default:{
            return state
        }
    }
}



export const productReviewReducer = ( state = { productReview: {} }, action ) => {

    switch (action.type) {
        
        case ADD_PRODUCT_REVIEW_REQUEST:
        case PRODUCT_REVIEWS_REQUEST:
        case DELETE_PRODUCT_REVIEW_REQUEST:{
            return ({
                reviewsLoading: true,
                productReview: {}
            })
        }

        case ADD_PRODUCT_REVIEW_SUCCESS:
        case PRODUCT_REVIEWS_SUCCESS: 
        case DELETE_PRODUCT_REVIEW_SUCCESS: {
            return ({
                reviewsLoading: false,
                productReview: action.payload.review,
            })
        }

        case ADD_PRODUCT_REVIEW_FAILURE:
        case PRODUCT_REVIEWS_FAILURE:
        case DELETE_PRODUCT_REVIEW_FAILURE: {
            return ({
                reviewsLoading: false,
                productReview: {},
                productReviewError: action.payload.message,
            })
        }
    
        default:{
            return state;
        }
    }
}