import Axios from 'axios';
import {IMAGE_RETRIEVE_FAIL, IMAGE_RETRIEVE_REQUEST, IMAGE_RETRIEVE_SUCCESS, IMAGE_UPLOAD_FAIL, IMAGE_UPLOAD_REQUEST, IMAGE_UPLOAD_SUCCESS} from '../constants/imageConstants'
import { sendEmail } from '../actions/sendEmailActions';
import CryptoJS from 'crypto-js';

export const retrieveImage = (stegoImageID) => async (dispatch) => {
    dispatch({
        type: IMAGE_RETRIEVE_REQUEST,
        payload: {stegoImageID}
    });
    try {
        const {data} = await Axios.post('/api/images/retrieve', {stegoImageID});
        dispatch({
            type: IMAGE_RETRIEVE_SUCCESS,
            payload: data
        });
    } catch(error) {
        dispatch({
            type: IMAGE_RETRIEVE_FAIL,
            payload: 
                error.message && error.response.data 
                    ? error.response.data
                    : error.message
        })
    }
}

export const uploadImage = (stegoImageURL, recipientEmail, plainSecretKey) => async (dispatch) => {
    dispatch({
        type: IMAGE_UPLOAD_REQUEST,
        payload: {stegoImageURL}
    });
    try {
        const {data} = await Axios.post('/api/images/upload', {stegoImageURL});

        dispatch({
            type: IMAGE_UPLOAD_SUCCESS,
            payload: data
        });

        if(recipientEmail){
            const secretKey = CryptoJS.AES.encrypt(plainSecretKey, 'this-is-my-ultra-large-secret-key!!!').toString();
            dispatch(sendEmail(recipientEmail, data._id, secretKey));
        }
    } catch(error) {
        dispatch({
            type: IMAGE_UPLOAD_FAIL,
            payload:
                error.message && error.response.data
                    ? error.response.data
                    : error.message
        });
    }
}