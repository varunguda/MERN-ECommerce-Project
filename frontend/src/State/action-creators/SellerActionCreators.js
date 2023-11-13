import axios from "axios";
import { SELLER_CHECK_FAILURE, SELLER_CHECK_REQUEST, SELLER_CHECK_SUCCESS } from "../constants/SellerConstants";


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