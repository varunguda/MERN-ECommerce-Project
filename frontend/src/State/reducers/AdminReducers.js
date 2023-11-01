import { 
    ADMIN_CHECK_FAILURE, 
    ADMIN_CHECK_REQUEST, 
    ADMIN_CHECK_SUCCESS,
    CREATE_PRODUCT_FAILURE,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_RESET,
    CREATE_PRODUCT_SUCCESS
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
