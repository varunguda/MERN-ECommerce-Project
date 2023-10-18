
import {
    USER_ADDRESS_ADD_REQUEST,
    USER_ADDRESS_ADD_SUCCESS,
    USER_ADDRESS_ADD_FAILURE,
    USER_ADDRESS_ADD_RESET,
    
    GET_USER_ADDRESSES_REQUEST,
    GET_USER_ADDRESSES_SUCCESS,
    GET_USER_ADDRESSES_FAILURE,
    
    USER_ADDRESS_UPDATE_REQUEST,
    USER_ADDRESS_UPDATE_SUCCESS,
    USER_ADDRESS_UPDATE_FAILURE,
    USER_ADDRESS_UPDATE_RESET,
    
    USER_ADDRESS_DELETE_REQUEST,
    USER_ADDRESS_DELETE_SUCCESS,
    USER_ADDRESS_DELETE_FAILURE,
    USER_ADDRESS_DELETE_RESET,

    USER_ORDERS_REQUEST,
    USER_ORDERS_SUCCESS,
    USER_ORDERS_FAILURE,
    CANCEL_USER_ORDER_REQUEST,
    CANCEL_USER_ORDER_SUCCESS,
    CANCEL_USER_ORDER_FAILURE,
    CANCEL_USER_ORDER_RESET
    
} from '../constants/ProfileConstants.js'



export const addAddressReducer = (state = { addedAddress: false }, action) => {

    switch (action.type) {

        case USER_ADDRESS_ADD_REQUEST:{
            return({
                addingAddress: true,
                addedAddress: false,
            })
        }

        case USER_ADDRESS_ADD_SUCCESS:{
            return ({
                addingAddress: false,
                addedAddress: action.payload.success,
                addedAddressMessage: action.payload.message,
            })
        }

        case USER_ADDRESS_ADD_FAILURE:{
            return ({
                addingAddress: false,
                addedAddress: false,
                addAddressError: "Unable to add your address, please try again!"
            })
        }

        case USER_ADDRESS_ADD_RESET:{
            return({
                addedAddress: false,
            })
        }

        default:{
            return state;
        }
    }
}



export const getAddressesReducer = (state = { addresses: [] }, action) => {

    switch (action.type) {
        
        case GET_USER_ADDRESSES_REQUEST:{
            return({
                gettingAddresses: true,
            })
        }

        case GET_USER_ADDRESSES_SUCCESS:{
            return ({
                gettingAddresses: false,
                addresses: action.payload.addresses,
            })
        }

        case GET_USER_ADDRESSES_FAILURE:{
            return ({
                gettingAddresses: false,
                addresses: []
            })
        }

        default:{
            return state;
        }
    }
}



export const updateDeleteAddressReducer = (state = { updatedDeletedAddress: false }, action) => {

    switch (action.type) {
        
        case USER_ADDRESS_DELETE_REQUEST:
        case USER_ADDRESS_UPDATE_REQUEST:{
            return({
                updatingDeletingAddress: true,
                updatedDeletedAddress: false,
            })
        }

        case USER_ADDRESS_DELETE_SUCCESS:
        case USER_ADDRESS_UPDATE_SUCCESS:{
            return ({
                updatingDeletingAddress: false,
                updatedDeletedAddress: action.payload.success,
                updateAddressMessage: action.payload.message,
            })
        }

        case USER_ADDRESS_DELETE_FAILURE:
        case USER_ADDRESS_UPDATE_FAILURE:{
            return ({
                updatingDeletingAddress: false,
                updatedDeletedAddress: false,
                updateAddressError: action.payload.message,
            })
        }

        case USER_ADDRESS_DELETE_RESET:
        case USER_ADDRESS_UPDATE_RESET:{
            return({
                updatedDeletedAddress: false,
            })
        }

        default:{
            return state;
        }
    }
}



export const getMyOrdersReducer = (state = { myOrders: [] }, action) => {

    switch (action.type) {
        
        case USER_ORDERS_REQUEST:{
            return({
                gettingMyOrders: true,
            })
        }

        case USER_ORDERS_SUCCESS:{
            return ({
                gettingMyOrders: false,
                myOrders: action.payload.orders,
                myOrdersCount: action.payload.ordersCount,
                totalOrdersCount: action.payload.totalOrdersCount,
            })
        }

        case USER_ORDERS_FAILURE:{
            return ({
                gettingMyOrders: false,
                myOrders: [],
                myOrdersCount: 0,
                totalOrdersCount: 0,
            })
        }

        default:{
            return state;
        }
    }
}



export const cancelMyOrderReducer = (state = {}, action) => {

    switch (action.type) {
        
        case CANCEL_USER_ORDER_REQUEST:{
            return({
                cancellingMyOrder: true,
            })
        }

        case CANCEL_USER_ORDER_SUCCESS:{
            return ({
                cancellingMyOrder: false,
                cancelledOrder: action.payload.success,
                cancelledOrderMessage: action.payload.message,
            })
        }

        case CANCEL_USER_ORDER_FAILURE:{
            return ({
                cancellingMyOrder: false,
                cancelledOrder: false,
                cancelledOrderMessage: action.payload.message,
            })
        }

        case CANCEL_USER_ORDER_RESET:{
            return ({});
        }

        default:{
            return state;
        }
    }
}