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
    USER_ADDRESS_DELETE_RESET
    
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



// export const deleteAddressReducer = (state = { deletedAddress: false }, action) => {

//     switch (action.type) {
        
//         case USER_ADDRESS_DELETE_REQUEST:{
//             return({
//                 deletingAddress: true,
//                 deletedAddress: false,
//             })
//         }

//         case USER_ADDRESS_DELETE_SUCCESS:{
//             return ({
//                 deletingAddress: false,
//                 deletedAddress: action.payload.success,
//                 deleteAddressMessage: action.payload.message,
//             })
//         }

//         case USER_ADDRESS_DELETE_FAILURE:{
//             return ({
//                 deletingAddress: false,
//                 deletedAddress: false,
//                 deleteAddressError: "Unable to remove your address, please try again!"
//             })
//         }

//         case USER_ADDRESS_DELETE_RESET:{
//             return({
//                 deletedAddress: false,
//             })
//         }

//         default:{
//             return state;
//         }
//     }
// }
