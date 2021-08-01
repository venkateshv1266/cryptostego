import {compose, applyMiddleware, createStore, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import { retrieveImageReducer, uploadImageReducer } from './reducers/imageReducers';
import { sendEmailReducer } from './reducers/sendEmailReducers';
import { changePasswordReducer, forgotPasswordReducer, isAuthorizedUserReducer, isEmailVerifiedReducer, resetPasswordReducer, sendEmailVerificationLinkReducer, userRegisterReducer, userSigninReducer } from './reducers/userReducers';

const initialState = {
    userSignin: {
        userInfoToken: localStorage.getItem('userInfoToken')
            ? JSON.parse(localStorage.getItem('userInfoToken'))
            : null
    },
    isAuthorized: {
        authorizedUserInfo: localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null
    },
};

const reducer = combineReducers({
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer,
    uploadImage: uploadImageReducer,
    retrieveImage: retrieveImageReducer,
    sendEmail: sendEmailReducer,
    sendEmailVerificationLink: sendEmailVerificationLinkReducer,
    isEmailVerified: isEmailVerifiedReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer,
    changePassword: changePasswordReducer,
    isAuthorized: isAuthorizedUserReducer,
});

//To display redux state changes in chrome> Inspect Element> DevTools> Redux
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer, 
    initialState,
    composeEnhancer(applyMiddleware(thunk)),
);

export default store;