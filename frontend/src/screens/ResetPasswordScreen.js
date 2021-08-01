import React, { useEffect, useState } from 'react';
import {Alert} from '@material-ui/lab';
import CryptoJS from 'crypto-js';
import ReactLoading from 'react-loading';
import {animateScroll as scroll} from 'react-scroll';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../actions/userActions';

function ResetPasswordScreen(props) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const token = (props.location.pathname).slice(15, (props.location.pathname).length); 

    const resetPasswordState = useSelector(state => state.resetPassword);
    const {resetPasswordSuccess, resetPasswordError, resetPasswordLoading = resetPasswordState.loading} = resetPasswordState;

    const submitHandler = (e) => {
        e.preventDefault();
        if(password===confirmPassword && (/^(?=.*[0-9])(?=.*[!@#$%^&*'])[a-zA-Z0-9!@#$%^&*']{6,16}$/.test(password))){
            const hashDigest = CryptoJS.SHA256(password);
            const hashedPassword = hashDigest.toString(CryptoJS.enc.Hex);
            dispatch(resetPassword(token, hashedPassword))
        }
    }
    
    useEffect(() => {
        if(resetPasswordSuccess) {
            props.history.push('/signin');
        }
        props.setCurrentActive('');
        props.setHeaderBg(true);
        scroll.scrollToTop();
    }, [props.currentActive, resetPasswordSuccess, props.history]);
    return (
        <div className="resetPasswordContainer">
            <div className="gridContainer">
                <div className="gridWrapper">
                    <div className="column1">
                        <form className="formContent" onSubmit={submitHandler}>
                            <p className="gridTopLine">Sign In</p>
                            <h1 className="gridColumnHeading">Reset Password</h1>
                            
                            <label htmlFor="password">Password</label>
                            <input type="password" id="name" placeholder="Enter password" required 
                                onChange={e => setPassword(e.target.value)}
                            />

                            {
                                password && !(/^(?=.*[0-9])(?=.*[!@#$%^&*'])[a-zA-Z0-9!@#$%^&*']{6,16}$/.test(password)) && 
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
                            
                            <label htmlFor="password">Confirm Password</label>
                            <input type="password" id="name" placeholder="Enter confirm password" required 
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                            {
                                password!==confirmPassword && <Alert severity="error">Password and confirm password should be same.</Alert>
                            }
                            <button type="submit" className="formBtn">Reset Password</button>
                            {resetPasswordError && <Alert severity="error">{resetPasswordError}</Alert>}
                            
                            {
                                resetPasswordLoading && 
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

export default ResetPasswordScreen;
