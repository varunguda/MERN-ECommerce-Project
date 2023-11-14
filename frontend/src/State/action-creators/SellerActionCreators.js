import axios from "axios";
import { SELLER_CHECK_FAILURE, SELLER_CHECK_REQUEST, SELLER_CHECK_SUCCESS, SELLER_DATA_ANALYSIS_FAILURE, SELLER_DATA_ANALYSIS_REQUEST, SELLER_DATA_ANALYSIS_SUCCESS } from "../constants/SellerConstants";


export const checkSeller = () => async(dispatch) => {
    
    try {
        dispatch({ type: SELLER_CHECK_REQUEST });

        const { data } = await axios.get("/api/v1/seller");

        dispatch({
            type: SELLER_CHECK_SUCCESS,
            payload: data,
        });
        
    } catch (error) {
        dispatch({
            type: SELLER_CHECK_FAILURE,
            payload: error.response.data.message,
        });
    };
};



export const getSellerDataAnalysis = () => async(dispatch) => {
    try {
        dispatch({ type: SELLER_DATA_ANALYSIS_REQUEST });

        const { data } = await axios.get("/api/v1/seller/analysis");

        dispatch({
            type: SELLER_DATA_ANALYSIS_SUCCESS,
            payload: data,
        })
        
    } catch (error) {
        dispatch({
            type: SELLER_DATA_ANALYSIS_FAILURE,
            payload: error.response.data.message,
        })
    }
}