import axios from "axios";
import { ADMIN_CHECK_FAILURE, ADMIN_CHECK_REQUEST, ADMIN_CHECK_SUCCESS, CREATE_PRODUCT_FAILURE, CREATE_PRODUCT_REQUEST, CREATE_PRODUCT_SUCCESS } from "../constants/AdminConstants";



export const checkAdmin = () => async(dispatch) => {
    
    try {
        dispatch({ type: ADMIN_CHECK_REQUEST });

        const { data } = await axios.get("/api/v1/admin");

        dispatch({
            type: ADMIN_CHECK_SUCCESS,
            payload: data,
        })
        
    } catch (error) {
        dispatch({
            type: ADMIN_CHECK_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const createProductAction = (products, variations, brand, category) => async(dispatch) => {
    try {
        
        dispatch({ type: CREATE_PRODUCT_REQUEST });

        const config = {headers: { "ContentType": "application/json"}};

        const { data } = await axios.post("/api/v1/myproducts", { products, variations, brand, category }, config);

        dispatch({
            type: CREATE_PRODUCT_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: CREATE_PRODUCT_FAILURE,
            payload: error.response.data.message,
        })
    }
}