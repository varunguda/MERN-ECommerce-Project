import axios from "axios";
import { ADMIN_CHECK_FAILURE, ADMIN_CHECK_REQUEST, ADMIN_CHECK_SUCCESS } from "../constants/AdminConstants";



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