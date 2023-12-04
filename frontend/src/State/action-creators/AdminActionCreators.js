import axios from "axios";
import {
    ADMIN_CHECK_FAILURE,
    ADMIN_CHECK_REQUEST,
    ADMIN_CHECK_SUCCESS,

    ALL_ORDERS_FAILURE,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,

    ALL_SELLERS_FAILURE,
    ALL_SELLERS_REQUEST,
    ALL_SELLERS_SUCCESS,

    ALL_USERS_FAILURE,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,

    CREATE_PRODUCT_FAILURE,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,

    DELETE_ANY_ORDER_FAILURE,
    DELETE_ANY_ORDER_REQUEST,
    DELETE_ANY_ORDER_SUCCESS,

    DELETE_USER_FAILURE,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,

    GET_DATA_ANALYSIS_FAILURE,

    GET_DATA_ANALYSIS_REQUEST,

    GET_DATA_ANALYSIS_SUCCESS,

    UPDATE_ANY_ORDER_STATUS_FAILURE,
    UPDATE_ANY_ORDER_STATUS_REQUEST,
    UPDATE_ANY_ORDER_STATUS_SUCCESS,

    UPDATE_USER_ROLE_FAILURE,
    UPDATE_USER_ROLE_REQUEST,
    UPDATE_USER_ROLE_SUCCESS
} from "../constants/AdminConstants";



export const checkAdmin = () => async (dispatch) => {

    try {
        dispatch({ type: ADMIN_CHECK_REQUEST });

        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin`);

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



export const getDataAnalysis = () => async (dispatch) => {
    try {
        dispatch({ type: GET_DATA_ANALYSIS_REQUEST });

        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/analysis`);

        dispatch({
            type: GET_DATA_ANALYSIS_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: GET_DATA_ANALYSIS_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const createProductAction = (products, variations, brand, category) => async (dispatch) => {
    try {

        dispatch({ type: CREATE_PRODUCT_REQUEST });

        const config = { headers: { "ContentType": "application/json" } };

        const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/myproducts`, { products, variations, brand, category }, config);

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



export const getAllOrders = (keyword, status, time, page) => async (dispatch) => {

    try {
        dispatch({ type: ALL_ORDERS_REQUEST });

        const queryParams = [
            keyword && `keyword=${keyword}`,
            status && `status=${status}`,
            time && `time=${time}`,
            page && `page=${page}`
        ].filter(Boolean).join(`&`);

        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/orders/all${queryParams ? '?' + queryParams : ''}`);

        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: ALL_ORDERS_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const deleteAnyOrder = (id) => async (dispatch) => {

    try {
        dispatch({ type: DELETE_ANY_ORDER_REQUEST });

        const { data } = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/orders/all${id}`);

        dispatch({
            type: DELETE_ANY_ORDER_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: DELETE_ANY_ORDER_FAILURE,
            payload: error.response.data.message,
        });
    }
}



export const updateAnyOrderStatus = (order_id, product_id, status) => async (dispatch) => {

    try {
        dispatch({ type: UPDATE_ANY_ORDER_STATUS_REQUEST });

        const config = { headers: { "ContentType": "application/json" } };

        const { data } = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/orders/all?order_id=${order_id}&product_id=${product_id}`, { status }, config);

        dispatch({
            type: UPDATE_ANY_ORDER_STATUS_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_ANY_ORDER_STATUS_FAILURE,
            payload: error.response.data.message,
        });
    }
}



export const getAllCustomers = (page) => async (dispatch) => {

    try {
        dispatch({ type: ALL_USERS_REQUEST });

        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/users/customers${page ? `?page=${page}` : ''}`);

        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const getAllSellers = (page) => async (dispatch) => {

    try {
        dispatch({ type: ALL_SELLERS_REQUEST });

        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/users/sellers${page ? `?page=${page}` : ''}`);

        dispatch({
            type: ALL_SELLERS_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: ALL_SELLERS_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const deleteAnyuser = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST });

        const { data } = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/user${id}`);

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const updateUserRole = (id, is_seller, is_admin) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_ROLE_REQUEST });

        const config = { headers: { "ContentType": "application/json" } };

        const { data } = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/user${id}`, { is_admin, is_seller }, config);

        dispatch({
            type: UPDATE_USER_ROLE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: UPDATE_USER_ROLE_FAILURE,
            payload: error.response.data.message,
        })
    }
}