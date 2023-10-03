import axios from "axios";
import {
    USER_CHECK_REQUEST,
    USER_CHECK_SUCCESS,
    USER_CHECK_FAILURE
} from "../constants/UserConstants.js";



export const checkUsersAccount = ( email ) => async(dispatch) => {
    try {
        
        dispatch({ type: USER_CHECK_REQUEST });

        const options = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.post(`/api/v1/checkuser`, { email }, options);

        dispatch({
            type: USER_CHECK_SUCCESS,
            payload: data,
        })
        
    } catch (error) {
        dispatch({
            type: USER_CHECK_FAILURE,
            payload: error.response.data.message,
        })
    }
}