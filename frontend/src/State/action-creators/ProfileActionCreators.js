import axios from "axios";
import {
    USER_ADDRESS_ADD_REQUEST,
    USER_ADDRESS_ADD_SUCCESS,
    USER_ADDRESS_ADD_FAILURE,

    GET_USER_ADDRESSES_REQUEST,
    GET_USER_ADDRESSES_SUCCESS,
    GET_USER_ADDRESSES_FAILURE,

    USER_ADDRESS_UPDATE_REQUEST,
    USER_ADDRESS_UPDATE_SUCCESS,
    USER_ADDRESS_UPDATE_FAILURE,

    USER_ADDRESS_DELETE_REQUEST,
    USER_ADDRESS_DELETE_SUCCESS,
    USER_ADDRESS_DELETE_FAILURE,

} from "../constants/ProfileConstants.js";



export const addUserAddress = (address) => async (dispatch) => {
    try {

        dispatch({ type: USER_ADDRESS_ADD_REQUEST });

        const {
            first_name,
            last_name,
            flat,
            street_address,
            landmark,
            city,
            state,
            zip,
            mobile,
            delivery_notes,
            default_address,
        } = address;

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.post("/api/v1/me/address", {
            first_name,
            last_name,
            flat,
            street_address,
            landmark,
            city,
            state,
            zip,
            mobile,
            delivery_notes,
            default_address,
        }, config);

        dispatch({
            type: USER_ADDRESS_ADD_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_ADDRESS_ADD_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const getUserAddresses = () => async (dispatch) => {

    try {

        dispatch({ type: GET_USER_ADDRESSES_REQUEST });

        const { data } = await axios.get("/api/v1/me/address");

        dispatch({
            type: GET_USER_ADDRESSES_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: GET_USER_ADDRESSES_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const updateUserAddress = (address, id) => async (dispatch) => {
    try {

        dispatch({ type: USER_ADDRESS_UPDATE_REQUEST });

        const {
            first_name,
            last_name,
            flat,
            street_address,
            landmark,
            city,
            state,
            zip,
            mobile,
            delivery_notes,
            default_address,
        } = address;

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.put(`/api/v1/me/address/${id}`, {
            first_name,
            last_name,
            flat,
            street_address,
            landmark,
            city,
            state,
            zip,
            mobile,
            delivery_notes,
            default_address,
        }, config);

        dispatch({
            type: USER_ADDRESS_UPDATE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_ADDRESS_UPDATE_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const deleteUserAddress = (id) => async (dispatch) => {

    try {

        dispatch({ type: USER_ADDRESS_DELETE_REQUEST });

        const { data } = await axios.delete(`/api/v1/me/address/${id}`);

        dispatch({
            type: USER_ADDRESS_DELETE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: USER_ADDRESS_DELETE_FAILURE,
            payload: error.response.data.message,
        })
    }
}
