import {
    USER_CHECK_REQUEST,
    USER_CHECK_SUCCESS,
    USER_CHECK_FAILURE,

    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGIN_USER_RESET,

    SIGNUP_USER_REQUEST,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAILURE,

    VERIFY_USER_REQUEST,
    VERIFY_USER_SUCCESS,
    VERIFY_USER_FAILURE,
    VERIFY_USER_RESET,

    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE,
    FORGOT_PASSWORD_RESET,

    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
    RESET_PASSWORD_RESET,

    LOAD_USER_FAILURE,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    
    SIGNOUT_USER_REQUEST,
    SIGNOUT_USER_SUCCESS,
    SIGNOUT_USER_FAILURE,
    SIGNOUT_USER_RESET,
    
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



export const loginReducer = ( state={ loggedIn: false, loginMessage: "", user: {} }, action ) => {

    switch (action.type) {
        
        case LOAD_USER_REQUEST:
        case LOGIN_USER_REQUEST:{
            return ({
                loginLoading: true,
                loggedIn: false,
            })
        }

        case LOAD_USER_SUCCESS:
        case LOGIN_USER_SUCCESS:{
            return ({
                loginLoading: false,
                loggedIn: action.payload.success,
                user: action.payload.user,
            })
        }

        case LOAD_USER_FAILURE:{
            return ({
                loginLoading: false,
                loggedIn: false, 
                loginMessage: "", 
                user: {}
            })
        }

        case LOGIN_USER_FAILURE:{
            return ({
                loginLoading: false,
                loginMessage: action.payload
            })
        }

        case LOGIN_USER_RESET:{
            return ({
                loggedIn: false, 
                loginMessage: "",
                user: {}
            })
        }
    
        default:{
            return state;
        }
    }
}


export const signupReducer = ( state={ sentSignupCode: false, signupMessage: "" }, action ) => {

    switch (action.type) {
        case SIGNUP_USER_REQUEST:{
            return ({
                signupLoading: true,
                sentSignupCode: false,
            })
        }

        case SIGNUP_USER_SUCCESS:{
            return ({
                signupLoading: false,
                sentSignupCode: action.payload.success,
                signupMessage: action.payload.message
            })
        }

        case SIGNUP_USER_FAILURE:{
            return ({
                signupLoading: false,
                sentSignupCode: false,
                signupError: action.payload
            })
        }
    
        default:{
            return state;
        }
    }
}



export const verifcationReducer = ( state={ verifiedUser: false, verifcationMessage: "" }, action ) => {

    switch (action.type) {
        case VERIFY_USER_REQUEST:{
            return ({
                verifcationLoading: true,
                verifiedUser: false,
            })
        }

        case VERIFY_USER_SUCCESS:{
            return ({
                verifcationLoading: false,
                verifiedUser: action.payload.success,
                verifcationMessage: action.payload.message
            })
        }

        case VERIFY_USER_FAILURE:{
            return ({
                verifcationLoading: false,
                verifiedUser: false,
                verifcationError: action.payload
            })
        }

        case VERIFY_USER_RESET:{
            return ({
                verifiedUser: false,
                verifcationMessage: "",
            })
        }
    
        default:{
            return state;
        }
    }
}



export const forgotPasswordReducer = ( state={ sentRecoveryMail: false, recoveryMailMessage: "" }, action ) => {

    switch (action.type) {
        case FORGOT_PASSWORD_REQUEST:{
            return ({
                sendingRecoveryMail: true,
                sentRecoveryMail: false,
            })
        }

        case FORGOT_PASSWORD_SUCCESS:{
            return ({
                sendingRecoveryMail: false,
                sentRecoveryMail: action.payload.success,
                recoveryMailMessage: action.payload.message
            })
        }

        case FORGOT_PASSWORD_FAILURE:{
            return ({
                sendingRecoveryMail: false,
                sentRecoveryMail: false,
                recoveryMailError: action.payload
            })
        }

        case FORGOT_PASSWORD_RESET:{
            return ({
                sentRecoveryMail: false,
                recoveryMailMessage: ""
            })
        }
    
        default:{
            return state;
        }
    }
}



export const resetPasswordReducer = ( state={ passwordChanged: false, resetPasswordMessage: "" }, action ) => {

    switch (action.type) {
        case RESET_PASSWORD_REQUEST:{
            return ({
                resettingPassword: true,
                passwordChanged: false,
            })
        }

        case RESET_PASSWORD_SUCCESS:{
            return ({
                resettingPassword: false,
                passwordChanged: action.payload.success,
                resetPasswordMessage: action.payload.message
            })
        }

        case RESET_PASSWORD_FAILURE:{
            return ({
                resettingPassword: false,
                passwordChanged: false,
                resetPasswordError: action.payload
            })
        }

        case RESET_PASSWORD_RESET:{
            return ({
                passwordChanged: false,
                resetPasswordMessage: "",
            })
        }
    
        default:{
            return state;
        }
    }
}



export const signOutReducer = (state = { signedOut: false, signOutMessage: "" }, action) => {

    switch (action.type) {
        case SIGNOUT_USER_REQUEST:{
            return({
                signOutLoading: true,
                signedOut: false,
            })
        }

        case SIGNOUT_USER_SUCCESS:{
            return ({
                signOutLoading: false,
                signedOut: action.payload.success,
                signOutMessage: action.payload.message,
            })
        }

        case SIGNOUT_USER_FAILURE:{
            return ({
                signOutLoading: false,
                signOutError: action.payload,
            })
        }

        case SIGNOUT_USER_RESET:{
            return ({
                signedOut: false, 
                signOutMessage: ""
            })
        }

        default:{
            return state;
        }
    }
}

