import {EMAIL_SEND_CLEAR, EMAIL_SEND_FAIL, EMAIL_SEND_REQUEST, EMAIL_SEND_SUCCESS} from '../constants/sendEmailConstants';

export const sendEmailReducer = (state = {}, action) => {
    switch(action.type) {
        case EMAIL_SEND_REQUEST:
            return{ 
                loading: true
            };
        case EMAIL_SEND_SUCCESS: 
            return{
                loading: false,
                sendEmailResponse: action.payload
            };
        case EMAIL_SEND_FAIL: 
            return {
                loading: false,
                error: action.payload
            };
        case EMAIL_SEND_CLEAR: 
            return {}
        default: 
            return state;
    }
}