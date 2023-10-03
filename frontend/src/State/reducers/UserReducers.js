import {
    USER_CHECK_REQUEST,
    USER_CHECK_SUCCESS,
    USER_CHECK_FAILURE
} from "../constants/UserConstants.js";



export const checkUserReducer = ( state = { userExist: false }, action ) => {
    switch (action.type) {
        case USER_CHECK_REQUEST:{
            return ({
                checkingUser: true,
                userExist: false,
                userEmail: ""
            })
        }

        case USER_CHECK_SUCCESS:{
            return ({
                checkingUser: false,
                userExist: action.payload.exists,
                userEmail: action.payload.email
            })
        }

        case USER_CHECK_FAILURE:{
            return ({
                checkingUser: false,
                userCheckError: action.payload
            })
        }
    
        default:{
            return state;
        }
    }
}