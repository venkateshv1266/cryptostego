import {IMAGE_RETRIEVE_CLEAR, IMAGE_RETRIEVE_FAIL, IMAGE_RETRIEVE_REQUEST, IMAGE_RETRIEVE_SUCCESS, IMAGE_UPLOAD_CLEAR, IMAGE_UPLOAD_FAIL, IMAGE_UPLOAD_REQUEST, IMAGE_UPLOAD_SUCCESS} from '../constants/imageConstants';

export const retrieveImageReducer = (state = {}, action) => {
    switch(action.type) {
        case IMAGE_RETRIEVE_REQUEST:
            return{loading:true};
        case IMAGE_RETRIEVE_SUCCESS:
            return{
                loading: false,
                stegoImage: action.payload
            }
        case IMAGE_RETRIEVE_FAIL: 
            return{
                loading: false,
                error: action.payload
            }
        case IMAGE_RETRIEVE_CLEAR : 
            return {
                stegoImage: undefined
            }
        default: 
            return state;
    }
}

export const uploadImageReducer = (state = {}, action) => {
    switch(action.type) {
        case IMAGE_UPLOAD_REQUEST: 
            return {loading: true};
        case IMAGE_UPLOAD_SUCCESS: 
            return {
                loading: false,
                stegoImage: action.payload
            };
        case IMAGE_UPLOAD_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case IMAGE_UPLOAD_CLEAR : 
            return {
                stegoImage: undefined
            }
        default :
            return state;
    }
}