import axios from "axios";

import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_FAILURE,
    ALL_PRODUCT_SUCCESS,
    CLEAR_ERRORS
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
            // payload: error.response.data.message
        })
    }
}


export const clearErrors = () => async(dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,
    })
}