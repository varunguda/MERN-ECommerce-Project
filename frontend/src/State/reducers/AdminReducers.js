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
    CREATE_PRODUCT_RESET,
    CREATE_PRODUCT_SUCCESS,

    DELETE_ANY_ORDER_FAILURE,
    DELETE_ANY_ORDER_REQUEST,
    DELETE_ANY_ORDER_SUCCESS,
    DELETE_UPDATE_ANY_ORDER_RESET,
    
    DELETE_USER_FAILURE,
    DELETE_USER_REQUEST,
    DELETE_USER_RESET,
    DELETE_USER_SUCCESS,
    
    GET_DATA_ANALYSIS_FAILURE,
    GET_DATA_ANALYSIS_REQUEST,
    GET_DATA_ANALYSIS_SUCCESS,
    
    UPDATE_ANY_ORDER_STATUS_FAILURE,
    UPDATE_ANY_ORDER_STATUS_REQUEST,
    UPDATE_ANY_ORDER_STATUS_SUCCESS,
    UPDATE_USER_ROLE_FAILURE,
    
    UPDATE_USER_ROLE_REQUEST,
    UPDATE_USER_ROLE_RESET,
    UPDATE_USER_ROLE_SUCCESS
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



export const dataAnalysisReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case GET_DATA_ANALYSIS_REQUEST:{
            return {
                fetchingAnalysis: true,
            }
        }

        case GET_DATA_ANALYSIS_SUCCESS:{
            return {
                fetchingAnalysis: false,
                fetchedAnalysis: payload.success,
                analysis: payload.analysis,
            }
        }

        case GET_DATA_ANALYSIS_FAILURE:{
            return {
                fetchingAnalysis: false,
                fetchedAnalysis: payload.success,
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



export const deleteOrUpdateAnyOrderReducer = (state = {}, action) => {

    switch (action.type) {
        
        case UPDATE_ANY_ORDER_STATUS_REQUEST:
        case DELETE_ANY_ORDER_REQUEST:{
            return({
                deletingOrUpdatingOrder: true,
            })
        }

        case UPDATE_ANY_ORDER_STATUS_SUCCESS:
        case DELETE_ANY_ORDER_SUCCESS:{
            return ({
                deletingOrUpdatingOrder: false,
                deletedOrUpdatedOrder: action.payload.success,
                deletedOrUpdatedMessage: action.payload.message,
            })
        }

        case UPDATE_ANY_ORDER_STATUS_FAILURE:
        case DELETE_ANY_ORDER_FAILURE:{
            return ({
                deletingOrUpdatingOrder: false,
                deletedOrUpdatedOrder: false,
                deletedOrUpdatedError: action.payload,
            })
        }

        case DELETE_UPDATE_ANY_ORDER_RESET:{
            return ({});
        }

        default:{
            return state;
        }
    }
}



export const getAllUsersReducer = (state = { users: [] }, action) => {

    switch (action.type) {
        
        case ALL_SELLERS_REQUEST:
        case ALL_USERS_REQUEST:{
            return({
                gettingAllUsers: true,
            })
        }

        case ALL_SELLERS_SUCCESS:
        case ALL_USERS_SUCCESS:{
            return ({
                gettingAllUsers: false,
                users: action.payload.users,
                totalUsersCount: action.payload.totalUsersCount,
            })
        }

        case ALL_SELLERS_FAILURE:
        case ALL_USERS_FAILURE:{
            return ({
                gettingAllUsers: false,
                users: [],
                totalUsersCount: 0,
            })
        }

        default:{
            return state;
        }
    }
}



export const deleteAnyUserReducer = (state = {}, action) => {

    switch (action.type) {
        
        case DELETE_USER_REQUEST:{
            return({
                deletingUser: true,
            })
        }

        case DELETE_USER_SUCCESS:{
            return ({
                deletingUser: false,
                deletedUser: action.payload.success,
                deletedUserMessage: action.payload.message,
            })
        }

        case DELETE_USER_FAILURE:{
            return ({
                deletingUser: false,
                deletedUser: false,
                deletedUserError: action.payload,
            })
        }

        case DELETE_USER_RESET:{
            return ({});
        }

        default:{
            return state;
        }
    }
}



export const updateAnyUserRoleReducer = (state = {}, action) => {

    switch (action.type) {
        
        case UPDATE_USER_ROLE_REQUEST:{
            return({
                updatingUserRole: true,
            })
        }

        case UPDATE_USER_ROLE_SUCCESS:{
            return ({
                updatingUserRole: false,
                updatedUserRole: action.payload.success,
                updatedUserRoleMessage: action.payload.message,
            })
        }

        case UPDATE_USER_ROLE_FAILURE:{
            return ({
                updatingUserRole: false,
                updatedUserRole: false,
                updatedUserRoleError: action.payload,
            })
        }

        case UPDATE_USER_ROLE_RESET:{
            return ({});
        }

        default:{
            return state;
        }
    }
}