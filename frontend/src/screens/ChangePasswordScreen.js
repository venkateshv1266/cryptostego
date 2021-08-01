import React, { useEffect, useState } from 'react';
import {Alert} from '@material-ui/lab';
import CryptoJS from 'crypto-js';
import ReactLoading from 'react-loading';
import {animateScroll as scroll} from 'react-scroll';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, isAuthorizedUser } from '../actions/userActions';
import { AUTHORIZE_FAIL, CLEAR_CHANGE_PASSWORD_STATE } from '../constants/userConstants';

function ChangePasswordScreen(props) {
    const [isAuthorizedLoading, setIsAuthorizedLoading] = useState(true);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const dispatch = useDispatch();

    const changePasswordState = useSelector(state => state.changePassword);
    const {changePasswordSuccess, changePasswordError } = changePasswordState;

    const isAuthorized = useSelector(state => state.isAuthorized);
    const { userInfo = isAuthorized.authorizedUserInfo, type} = isAuthorized;

    const submitHandler = (e) => {
        e.preventDefault();
        if(oldPassword && newPassword===confirmNewPassword && (/^(?=.*[0-9])(?=.*[!@#$%^&*'])[a-zA-Z0-9!@#$%^&*']{6,16}$/.test(newPassword))){
            const hashedOldPassword = CryptoJS.SHA256(oldPassword).toString(CryptoJS.enc.Hex);
            const hashedNewPassword = CryptoJS.SHA256(newPassword).toString(CryptoJS.enc.Hex);
            dispatch(changePassword(hashedOldPassword, hashedNewPassword));
        }
    }
    
    useEffect(() => {
        dispatch(isAuthorizedUser(setIsAuthorizedLoading));
        if(changePasswordSuccess) {
            dispatch({type: CLEAR_CHANGE_PASSWORD_STATE});
            props.history.push(`/userprofile/${userInfo._id}`);
        }
        props.setCurrentActive('');
        props.setHeaderBg(true);
        scroll.scrollToTop();
    }, [props.currentActive, changePasswordSuccess]);
    return (
        <div>
        {
            isAuthorizedLoading ?
            (
                <div className="loadingWrapper">
                    <ReactLoading type='bars' color={'#01193d'} height={'30%'} width={'30%'} />
                </div>
            )
            : type===AUTHORIZE_FAIL ? 
            (
                <div>
                    {props.history.push('/signin')}
                </div>
            )
            :userInfo &&
            (
                <div className="resetPasswordContainer">
                    <div className="gridContainer">
                        <div className="gridWrapper">
                            <div className="column1">
                                <form className="formContent" onSubmit={submitHandler}>
                                    <p className="gridTopLine">Sign In</p>
                                    <h1 className="gridColumnHeading">Change Password</h1>
                                    
                                    <label htmlFor="oldPassword">Old Password</label>
                                    <input type="password" id="oldPassword" placeholder="Enter old password" required 
                                        onChange={e => setOldPassword(e.target.value)}
                                    />

                                    <label htmlFor="newPassword">New Password</label>
                                    <input type="password" id="newPassword" placeholder="Enter new password" required 
                                        onChange={e => setNewPassword(e.target.value)}
                                    />

                                    {
                                        newPassword && !(/^(?=.*[0-9])(?=.*[!@#$%^&*'])[a-zA-Z0-9!@#$%^&*']{6,16}$/.test(newPassword)) && 
                                        (
                                            <Alert className="emailAlert" severity="error">Password must be of length 6 - 16. It must contain atleast,
                                                <ul>
                                                    <li>one special character (!@#$%^&*')</li>
                                                    <li>one digit (0-9)</li>
                                                    <li>one uppercase alphabet (A-Z) and </li>
                                                    <li>one lowercase alphabet (a-z)</li>
                                                </ul>
                                            </Alert>
                                        )
                                    }   
                                    
                                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                                    <input type="password" id="confirmNewPassword" placeholder="Enter confirm new password" required 
                                        onChange={e => setConfirmNewPassword(e.target.value)}
                                    />
                                    {
                                        newPassword!==confirmNewPassword && <Alert severity="error">New password and confirm new password should be same.</Alert>
                                    }
                                    <button type="submit" className="formBtn">Change Password</button>
                                    {changePasswordError && <Alert severity="error">{changePasswordError}</Alert>}
                                    
                                    {
                                        changePasswordState.loading && 
                                            (
                                                <div className="loadingWrapper">
                                                    <ReactLoading type='bars' color={'#01193d'} height={'10%'} width={'10%'} />
                                                </div>
                                            )
                                        }
                                </form>
                            
                            </div>
                            
                            
                            <div className="column2">
                                <div className="imageWrap">
                                    <img src="/images/svg4.svg" alt="" /> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        </div>
    )
}

export default ChangePasswordScreen;
