import axios from "axios";
import {
    USER_CHECK_REQUEST,
    USER_CHECK_SUCCESS,
    USER_CHECK_FAILURE,

    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,

    SIGNUP_USER_REQUEST,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAILURE,

    VERIFY_USER_REQUEST,
    VERIFY_USER_SUCCESS,
    VERIFY_USER_FAILURE,

    FORGOT_PASSWORD_FAILURE,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,

    RESET_PASSWORD_FAILURE,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,

    LOAD_USER_FAILURE,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,

    SIGNOUT_USER_FAILURE,
    SIGNOUT_USER_SUCCESS,
    SIGNOUT_USER_REQUEST,

    LIST_ITEMS_REQUEST,
    LIST_ITEMS_SUCCESS,
    LIST_ITEMS_FAILURE,
    LIST_PRODUCTS_REQUEST,
    LIST_PRODUCTS_SUCCESS,
    LIST_PRODUCTS_FAILURE,
    EMPTY_LIST_ITEMS_REQUEST,
    EMPTY_LIST_ITEMS_SUCCESS,
    EMPTY_LIST_ITEMS_FAILURE,

} from "../constants/UserConstants.js";



export const checkUsersAccount = (email) => async (dispatch) => {

    try {

        dispatch({ type: USER_CHECK_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.post(`/api/v1/checkuser`, { email }, config);

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



export const loginUser = (email, pass) => async (dispatch) => {

    try {

        dispatch({
            type: LOGIN_USER_REQUEST
        })

        const config = { headers: { "Content-Type": "application/json" } }

        const { data } = await axios.post("/api/v1/login", { email, password: pass }, config);

        dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: data,
        })

    } catch (error) {

        dispatch({
            type: LOGIN_USER_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const loadUser = () => async (dispatch) => {

    try {

        dispatch({ type: LOAD_USER_REQUEST });

        const { data } = await axios.get("/api/v1/me");

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const signupUser = (user) => async (dispatch) => {

    try {

        dispatch({
            type: SIGNUP_USER_REQUEST
        })

        const config = { headers: { "Content-Type": "application/json" } }

        const { data } = await axios.post("/api/v1/register", { name: user.name, email: user.mail, password: user.confirmPass, avatar: user.avatar }, config);

        dispatch({
            type: SIGNUP_USER_SUCCESS,
            payload: data,
        })

    } catch (error) {

        dispatch({
            type: SIGNUP_USER_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const verifyUser = (code) => async (dispatch) => {

    try {

        dispatch({
            type: VERIFY_USER_REQUEST
        })

        const config = { headers: { "Content-Type": "application/json" } }

        const { data } = await axios.post("/api/v1/register-verify", { userCode: code }, config);

        dispatch({
            type: VERIFY_USER_SUCCESS,
            payload: data,
        })

    } catch (error) {

        dispatch({
            type: VERIFY_USER_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const sendPassRecoveryMail = (email) => async (dispatch) => {

    try {

        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.post(`/api/v1/password/forgot`, { email }, config);

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const resetPassword = (pass, confirmPass, token) => async (dispatch) => {

    try {

        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.put(`/api/v1/password/reset/${token}`, { password: pass, confirmPassword: confirmPass }, config);

        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: RESET_PASSWORD_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const signOutUser = () => async (dispatch) => {

    try {

        dispatch({ type: SIGNOUT_USER_REQUEST });

        const { data } = await axios.get("/api/v1/logout");

        dispatch({
            type: SIGNOUT_USER_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: SIGNOUT_USER_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const getListItems = () => async (dispatch) => {
    try {

        dispatch({ type: LIST_ITEMS_REQUEST });

        const { data } = await axios.get("/api/v1/me/list");

        dispatch({
            type: LIST_ITEMS_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: LIST_ITEMS_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const toggleListItem = (id) => async () => {
    try {
        return await axios.get(`/api/v1/me/list/${id}`);
    } catch (error) {
        console.error(error);
    }
}



export const getListProducts = () => async (dispatch) => {
    try {

        dispatch({ type: LIST_PRODUCTS_REQUEST });

        const { data } = await axios.get("/api/v1/me/list/products");

        dispatch({
            type: LIST_PRODUCTS_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: LIST_PRODUCTS_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const emptyListItems = () => async (dispatch) => {
    try {
        dispatch({ type: EMPTY_LIST_ITEMS_REQUEST });

        const { data } = await axios.delete("/api/v1/me/list");

        dispatch({
            type: EMPTY_LIST_ITEMS_SUCCESS,
            payload: data,
        });
        
    } catch (error) {
        dispatch({
            type: EMPTY_LIST_ITEMS_FAILURE,
            payload: error.response.data.message,
        })
    }
}