import Axios from 'axios';
import { USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNIN_FAIL, USER_SIGNOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, PASSWORD_RESET_REQUEST, PASSWORD_RESET_FAIL, PASSWORD_RESET_SUCCESS, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL, AUTHORIZE_REQUEST, AUTHORIZE_FAIL, AUTHORIZE_SUCCESS, CLEAR_AUTHORIZE_INFO, SEND_EMAIL_VERIFICATION_LINK_REQUEST, SEND_EMAIL_VERIFICATION_LINK_SUCCESS, SEND_EMAIL_VERIFICATION_LINK_FAIL, IS_EMAIL_VERIFIED_REQUEST, IS_EMAIL_VERIFIED_SUCCESS, IS_EMAIL_VERIFIED_FAIL, CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAIL } from '../constants/userConstants';

export const register = (name, email, password) => async(dispatch) => {
    dispatch({
        type: USER_REGISTER_REQUEST,
        payload: {name, email, password}
    });
    try{
        const { data } = await Axios.post('/api/users/register', {name, email, password});
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        });
        dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: data
        });
        localStorage.setItem("userInfoToken", JSON.stringify(data));
        dispatch(isAuthorizedUser());
    } catch(error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: 
                error.response && error.response.data 
                    ? error.response.data
                    : error.message
        });
    }
}

export const signin = (email, password, tokenId) => async(dispatch) => {
    dispatch({
        type: USER_SIGNIN_REQUEST,
        payload: {email, password},
    });
    try{
        let data;
        if(tokenId) {
            ({data} = await Axios.post('/api/users/googlesignin', {tokenId}));
        } else {
            ({data} = await Axios.post('/api/users/signin', {email, password}))
        }
        dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: data
        });
        localStorage.setItem("userInfoToken", JSON.stringify(data));
        dispatch(isAuthorizedUser());
    }catch(error) {
        dispatch({
            type: USER_SIGNIN_FAIL,
            payload: 
                error.response && error.response.data 
                    ? error.response.data
                    : error.message
        });
    }
};

export const signout = () => async (dispatch) => {
    localStorage.removeItem('userInfoToken');
    localStorage.removeItem('userInfo');

    dispatch({
        type: USER_SIGNOUT
    });
};

export const sendEmailVerificationLink = () => async(dispatch, getState) => {
    dispatch({
        type: SEND_EMAIL_VERIFICATION_LINK_REQUEST
    });
    try{
        const { isAuthorized: {authorizedUserInfo}} = getState();
        const email = authorizedUserInfo.email;
        const {data} = await Axios.post('/api/users/sendverificationemail', {email});
        dispatch({
            type: SEND_EMAIL_VERIFICATION_LINK_SUCCESS, 
            payload: data
        })
    } catch(error) {
        dispatch({
            type: SEND_EMAIL_VERIFICATION_LINK_FAIL,
            payload: 
                error.response && error.response.data 
                    ? error.response.data
                    : error.message
        });
    }
};

export const isEmailVerified = (token) => async (dispatch) => {
    dispatch({
        type: IS_EMAIL_VERIFIED_REQUEST
    });
    try {
        const {data} = await Axios.patch(`/api/users/emailverification/${token}`);
        dispatch({
            type: IS_EMAIL_VERIFIED_SUCCESS, 
            payload: data
        });
    } catch(error) {
        dispatch({
            type: IS_EMAIL_VERIFIED_FAIL,
            payload: 
                error.response && error.response.data 
                    ? error.response.data
                    : error.message
        });
    }
}

export const forgotPassword = (email) => async(dispatch) => {
    dispatch({
        type: FORGOT_PASSWORD_REQUEST,
        payload: {email}
    });
    try {
        const {data} = await Axios.post('/api/users/forgotpassword', {email});
        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data
        });
    } catch(error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: 
                error.response && error.response.data 
                    ? error.response.data
                    : error.message
        });
    }
}

export const resetPassword = (token, password) => async (dispatch) => {
    dispatch({
        type: PASSWORD_RESET_REQUEST,
        payload: {token}
    });
    try {
        const {data} = await Axios.patch(`/api/users/resetpassword/${token}`, {password});
        dispatch({
            type: PASSWORD_RESET_SUCCESS,
            payload: data
        });
    } catch(error) {
        dispatch({
            type: PASSWORD_RESET_FAIL,
            payload: 
                error.response && error.response.data 
                    ? error.response.data
                    : error.message
        });
    }
};

export const changePassword = (oldPassword, newPassword) => async(dispatch, getState) => {
    dispatch({
        type: CHANGE_PASSWORD_REQUEST
    });
    try {
        const { isAuthorized: {authorizedUserInfo}} = getState();
        const _id = authorizedUserInfo._id;

        const { data } = await Axios.patch('/api/users/changepassword',{_id, oldPassword, newPassword});

        dispatch({
            type: CHANGE_PASSWORD_SUCCESS,
            payload: data,
        });

    } catch(error) {
        dispatch({
            type: CHANGE_PASSWORD_FAIL,
            payload: 
                error.response && error.response.data 
                    ? error.response.data
                    : error.message
        });
    }
}

export const isAuthorizedUser = (setIsAuthorizedLoading) => async (dispatch, getState) => {
    dispatch({
        type: AUTHORIZE_REQUEST
    });
    try {
        const { userSignin: {userInfoToken}} = getState();
        const { data } = await Axios.get('/api/users/userinfo', {
            headers: {
                Authorization: `CryptoStego ${userInfoToken.token}`,
            }
        });
        dispatch({
            type: AUTHORIZE_SUCCESS,
            payload: data,
        });
        if(setIsAuthorizedLoading) {
            setIsAuthorizedLoading(false);
        }
        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch(error) {
        dispatch({
            type: AUTHORIZE_FAIL,
            payload: 
                error.response && error.response.data 
                    ? error.response.data
                    : error.message
        });
        dispatch({
            type: CLEAR_AUTHORIZE_INFO
        });
        dispatch(signout());
        if(setIsAuthorizedLoading) {
            setIsAuthorizedLoading(false);
        }
    }
};