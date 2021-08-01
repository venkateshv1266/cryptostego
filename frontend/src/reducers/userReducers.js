import { USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNIN_FAIL, USER_SIGNOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL, PASSWORD_RESET_REQUEST, PASSWORD_RESET_SUCCESS, PASSWORD_RESET_FAIL, AUTHORIZE_REQUEST, AUTHORIZE_SUCCESS, AUTHORIZE_FAIL, CLEAR_AUTHORIZE_INFO, SEND_EMAIL_VERIFICATION_LINK_REQUEST, SEND_EMAIL_VERIFICATION_LINK_SUCCESS, SEND_EMAIL_VERIFICATION_LINK_FAIL, IS_EMAIL_VERIFIED_REQUEST, IS_EMAIL_VERIFIED_SUCCESS, IS_EMAIL_VERIFIED_FAIL, CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAIL, CLEAR_CHANGE_PASSWORD_STATE } from '../constants/userConstants';

export const userRegisterReducer = (state = {}, action) => {
    switch(action.type){
        case USER_REGISTER_REQUEST: 
            return {loading:true};
        case USER_REGISTER_SUCCESS:
            return {
                loading: false,
                userInfoToken: action.payload,
                type: action.type
            }
        case USER_REGISTER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_SIGNOUT: 
            return {};
        default: 
            return state;
    }
}
export const userSigninReducer = (state = {}, action) => {
    switch(action.type){
        case USER_SIGNIN_REQUEST:
            return {loading: true};
        case USER_SIGNIN_SUCCESS:
            return {
                loading: false,
                userInfoToken: action.payload,
                type: action.type
            }
        case USER_SIGNIN_FAIL: 
            return {
                loading: false, 
                error: action.payload
            };
        case USER_SIGNOUT: 
            return {type: USER_SIGNOUT};
        default:
            return state;
    }
};

export const sendEmailVerificationLinkReducer = (state = {}, action) => {
    switch(action.type) {
        case SEND_EMAIL_VERIFICATION_LINK_REQUEST :
            return{loading: true};
        case SEND_EMAIL_VERIFICATION_LINK_SUCCESS:
            return{
                loading: false,
                sendEmailVerificationLinkMessage: action.payload, 
                type: SEND_EMAIL_VERIFICATION_LINK_SUCCESS
            };
        case SEND_EMAIL_VERIFICATION_LINK_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        default: 
            return state;
    }
};

export const isEmailVerifiedReducer = ( state = {}, action ) => {
    switch(action.type) {
        case IS_EMAIL_VERIFIED_REQUEST:
            return{loading: true};
        case IS_EMAIL_VERIFIED_SUCCESS:
            return {
                loading: false,
                isEmailVerifiedMessage: action.payload
            };
        case IS_EMAIL_VERIFIED_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        default: 
            return state;
    }
}

export const forgotPasswordReducer = (state = {}, action) => {
    switch(action.type) {
        case FORGOT_PASSWORD_REQUEST:
            return {loading: true};
        case FORGOT_PASSWORD_SUCCESS:
            return {
                loading: false,
                forgotPasswordSuccess: action.payload
            };
        case FORGOT_PASSWORD_FAIL:
            return {
                loading: false,
                forgotPasswordError: action.payload
            };
        default: 
            return state;
    }
};

export const resetPasswordReducer = (state = {}, action) => {
    switch(action.type) {
        case PASSWORD_RESET_REQUEST:
            return {loading: true};
        case PASSWORD_RESET_SUCCESS:
            return {
                loading: false,
                resetPasswordSuccess: action.payload,
                type: action.type
            };
        case PASSWORD_RESET_FAIL:
            return {
                loading: false,
                resetPasswordError: action.payload
            };
        default: 
            return state;
    }
};

export const changePasswordReducer = (state = {}, action) => {
    switch(action.type) {
        case CHANGE_PASSWORD_REQUEST: 
            return{loading: true};
        case CHANGE_PASSWORD_SUCCESS: 
            return{
                loading: false,
                changePasswordSuccess: action.payload,
                type: action.type
            };
        case CHANGE_PASSWORD_FAIL:
            return {
                loading: false,
                changePasswordError: action.payload
            };
        case CLEAR_CHANGE_PASSWORD_STATE :
            return {}
        default: 
            return state;
    }
}

export const isAuthorizedUserReducer = (state = {}, action) => {
    switch(action.type) {
        case AUTHORIZE_REQUEST: 
            return{loading: true};
        case AUTHORIZE_SUCCESS:
            return {
                loading: false,
                authorizedUserInfo: action.payload,
                type: AUTHORIZE_SUCCESS
            };
        case AUTHORIZE_FAIL:
            return {
                loading: false,
                authorizeError: action.payload
            };
        case CLEAR_AUTHORIZE_INFO: 
            return {type: AUTHORIZE_FAIL}
        default: 
            return state;
    }
}