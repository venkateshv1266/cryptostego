import Axios from 'axios';
import {EMAIL_SEND_FAIL, EMAIL_SEND_REQUEST, EMAIL_SEND_SUCCESS} from '../constants/sendEmailConstants';

export const sendEmail = (recipientEmail, stegoImageID, secretKey) => async(dispatch) => {
    dispatch({
        type: EMAIL_SEND_REQUEST,
        payload: {recipientEmail, stegoImageID, secretKey}
    });
    try {
        const {data} = await Axios.post('/api/sendmail', {recipientEmail, stegoImageID, secretKey});
        dispatch({
            type: EMAIL_SEND_SUCCESS,
            payload: data
        });
    } catch(error) {
        dispatch({
            type: EMAIL_SEND_FAIL,
            payload: 
                error.message && error.response.data 
                    ? error.response.data
                    : error.message
        });
    }
}
