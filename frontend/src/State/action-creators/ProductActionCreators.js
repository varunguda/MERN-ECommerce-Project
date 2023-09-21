import axios from "axios";
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_FAILURE,
    ALL_PRODUCT_SUCCESS,

    PRODUCT_DETAILS_FAILURE,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,

    SELLER_PRODUCT_REQUEST,
    SELLER_PRODUCT_FAILURE,
    SELLER_PRODUCT_SUCCESS,

    BUNDLE_PRODUCTS_FAILURE,
    BUNDLE_PRODUCTS_REQUEST,
    BUNDLE_PRODUCTS_SUCCESS,

    PRODUCT_REVIEWS_REQUEST,
    PRODUCT_REVIEWS_FAILURE,
    PRODUCT_REVIEWS_SUCCESS

} from "../constants/ProductConstants.js";



export const getProducts = () => async(dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });

        const { data } = await axios.get("/api/v1/products");
        
        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: ALL_PRODUCT_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const getProductDetails = ({ id }) => async(dispatch) => {
    try {
        
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/v1/products/${id}`);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const getAllProductsOfSeller = (id) => async(dispatch) => {
    try {
        
        dispatch({ type : SELLER_PRODUCT_REQUEST });

        const { data } = await axios.get(`/api/v1/products/seller/${id}`); 

        dispatch({
            type: SELLER_PRODUCT_SUCCESS,
            payload: data.products,
        })

    } catch (error) {
        dispatch({
            type: SELLER_PRODUCT_FAILURE,
            payload: error.response.data.message
        })
    }
} 



export const getBundleProducts = (id) => async(dispatch) => {
    try {

        dispatch({ type: BUNDLE_PRODUCTS_REQUEST });

        const { data } = await axios.get(`/api/v1/products/bundles/${id}`);

        dispatch({
            type: BUNDLE_PRODUCTS_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: BUNDLE_PRODUCTS_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const getProductReviews = (id) => async(dispatch) => {
    try {

        dispatch({ type: PRODUCT_REVIEWS_REQUEST });

        const { data } = await axios.get(`/api/v1/products/reviews/${id}`);

        dispatch({
            type: PRODUCT_REVIEWS_SUCCESS,
            payload: data,
        })
        
    } catch (error) {
        dispatch({
            type: PRODUCT_REVIEWS_FAILURE,
            payload: error.response.data.message,
        })
    }
}