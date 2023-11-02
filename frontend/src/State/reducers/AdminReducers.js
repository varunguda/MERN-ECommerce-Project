import { 
    ADMIN_CHECK_FAILURE, 
    ADMIN_CHECK_REQUEST, 
    ADMIN_CHECK_SUCCESS,

    ALL_ORDERS_FAILURE,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    
    CANCEL_ANY_ORDER_FAILURE,
    CANCEL_ANY_ORDER_REQUEST,
    CANCEL_ANY_ORDER_SUCCESS,
    
    CREATE_PRODUCT_FAILURE,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_RESET,
    CREATE_PRODUCT_SUCCESS,

    DELETE_ANY_ORDER_FAILURE,
    DELETE_ANY_ORDER_REQUEST,
    DELETE_ANY_ORDER_SUCCESS,
    DELETE_CANCEL_ANY_ORDER_RESET
} from "../constants/AdminConstants"


export const adminReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case ADMIN_CHECK_REQUEST:{
            return {
                checkingAdmin: true,
            }
        }

        case ADMIN_CHECK_SUCCESS:{
            return {
                checkingAdmin: false,
                isAdmin: payload.success,
                admin: payload.admin,
            }
        }
        case ADMIN_CHECK_FAILURE:{
            return {
                checkingAdmin: false,
                isAdmin: false,
            }
        }

        default:
            return state
    }
}


export const createProductReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case CREATE_PRODUCT_REQUEST:{
            return {
                creatingProduct: true,
            }
        }

        case CREATE_PRODUCT_SUCCESS:{
            return {
                creatingProduct: false,
                createdProduct: payload.success,
                createdProductMessage: payload.message,
            }
        }
        
        case CREATE_PRODUCT_FAILURE:{
            return {
                creatingProduct: false,
                createdProduct: false,
                createProductError: payload,
            }
        }

        case CREATE_PRODUCT_RESET:{
            return {}
        }

        default:
            return state
    }
}



export const getAllOrdersReducer = (state = { allOrders: [] }, action) => {

    switch (action.type) {
        
        case ALL_ORDERS_REQUEST:{
            return({
                gettingAllOrders: true,
            })
        }

        case ALL_ORDERS_SUCCESS:{
            return ({
                gettingAllOrders: false,
                allOrders: action.payload.orders,
                allOrdersCount: action.payload.ordersCount,
                totalOrdersCount: action.payload.totalOrdersCount,
            })
        }

        case ALL_ORDERS_FAILURE:{
            return ({
                gettingAllOrders: false,
                allOrders: [],
                allOrdersCount: 0,
                totalOrdersCount: 0,
            })
        }

        default:{
            return state;
        }
    }
}



export const deleteOrCancelAnyOrderReducer = (state = {}, action) => {

    switch (action.type) {
        
        case CANCEL_ANY_ORDER_REQUEST:
        case DELETE_ANY_ORDER_REQUEST:{
            return({
                deletingOrCancellingOrder: true,
            })
        }

        case CANCEL_ANY_ORDER_SUCCESS:
        case DELETE_ANY_ORDER_SUCCESS:{
            return ({
                deletingOrCancellingOrder: false,
                deletedOrCancelledOrder: action.payload.success,
                deletedOrCancelledMessage: action.payload.message,
            })
        }

        case CANCEL_ANY_ORDER_FAILURE:
        case DELETE_ANY_ORDER_FAILURE:{
            return ({
                deletingOrCancellingOrder: false,
                deletedOrCancelledOrder: false,
                deletedOrCancelledError: action.payload,
            })
        }

        case DELETE_CANCEL_ANY_ORDER_RESET:{
            return ({});
        }

        default:{
            return state;
        }
    }
}