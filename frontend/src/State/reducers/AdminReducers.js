import { ADMIN_CHECK_FAILURE, ADMIN_CHECK_REQUEST, ADMIN_CHECK_SUCCESS } from "../constants/AdminConstants"

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
