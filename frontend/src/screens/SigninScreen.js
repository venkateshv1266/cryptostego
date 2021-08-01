import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import {animateScroll as scroll} from 'react-scroll';
import ReactLoading from 'react-loading';
import CryptoJS from 'crypto-js';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, signin } from '../actions/userActions';
import { Alert as AlertSnackbar }  from '../components/Alert';
import {Alert} from '@material-ui/lab'
import { AUTHORIZE_SUCCESS, USER_SIGNIN_SUCCESS } from '../constants/userConstants';

function SigninScreen(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);
    const dispatch = useDispatch(); 

    const userSignin = useSelector(state => state.userSignin);
    const { userSigninLoading = userSignin.loading } = userSignin;

    const isAuthorized = useSelector(state => state.isAuthorized); 

    const forgotPasswordState = useSelector(state => state.forgotPassword);
    const {forgotPasswordSuccess, forgotPasswordError, forgotPasswordLoading = forgotPasswordState.loading} = forgotPasswordState;

    const redirect = props.location.search
        ? props.location.search.split('=')[1]
        : '/';

    const submitHandler = (e) => {
        e.preventDefault();
        setError(false);
        const hashDigest = CryptoJS.SHA256(password);
        const hashedPassword = hashDigest.toString(CryptoJS.enc.Hex);
        dispatch(signin(email.trim(),hashedPassword));
    }

    const forgotPasswordSubmitHandler = (e) => {
        e.preventDefault();
        if(email) {
            dispatch(forgotPassword(email));
        } 
    }
    const toggleForgotPasswordClicked = () => {
        setForgotPasswordClicked(!forgotPasswordClicked);
    }

    const responseSuccessGoogle = async (response) => {
        setError(false);
        const tokenId = response.tokenId;
        dispatch(signin(email, password, tokenId));
    }

    const responseFailureGoogle = () => {
        setError(true);
    }

    useEffect(() => {
        if(userSignin.type === USER_SIGNIN_SUCCESS && isAuthorized.type === AUTHORIZE_SUCCESS) {
            props.history.push(redirect);
        } 
        props.setCurrentActive('');
        props.setHeaderBg(true);
        scroll.scrollToTop();
    },[props.currentActive, isAuthorized.type , props.history, redirect]);
    return (
        <div className="signinContainer">
            <div className="gridContainer">
                <div className="gridWrapper gridWrapperSigninSignup">
                    <div className="column1">
                        <div className="loginDiv" style={{display:`${forgotPasswordClicked ? 'none' : 'block'}`}}>
                            {
                                userSignin.error && <AlertSnackbar message={userSignin.error} variant="error"/>
                            }
                            <form className="formContent" onSubmit={submitHandler}>
                                <p className="gridTopLine">Sign In</p>
                                <h1 className="gridColumnHeading">Login to your account</h1>
                                
                                <label htmlFor="email">Email</label> 
                                <input type="text" id="name" placeholder="Enter email" required 
                                    onChange={e => setEmail(e.target.value)}
                                />
                                
                                {
                                    email && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) && <Alert className="emailAlert" severity="error">Enter valid Email ID</Alert>
                                }

                                <label htmlFor="password">Password</label>
                                <input type="password" id="name" placeholder="Enter password" required 
                                    onChange={e => setPassword(e.target.value)}
                                />
                                
                                <button type="submit" className="formBtn">Sign In</button>
                                
                                <GoogleLogin className="googleSigninBtn"
                                    clientId="752556476606-pug61r3jpua9dd84bo35qua39b1g64cb.apps.googleusercontent.com"
                                    buttonText="Sign In With Google"
                                    onSuccess={responseSuccessGoogle}
                                    onFailure={responseFailureGoogle}
                                    cookiePolicy={'single_host_origin'}
                                />
                                
                                {error && <Alert severity="error">Something went wrong.</Alert>}
                            </form>
                            
                            
                            {
                                userSigninLoading || isAuthorized.loading && 
                                (
                                    <div className="loadingWrapper">
                                        <ReactLoading type='bars' color={'#01193d'} height={'10%'} width={'10%'} />
                                    </div>
                                )
                            }
                            <div className="formBottomLine">
                                <span className="formBottomLink" onClick={toggleForgotPasswordClicked}>Forgot Password?</span>
                            </div>
                            
                            <div className="formBottomLine">
                                <span className="formBottomText">Don't have an account?</span>
                                <Link className="formBottomLink" to={`/signup?redirect=${redirect}`}>Sign Up</Link>
                            </div>
                        </div>
                        
                        <div className="forgotPasswordDiv" style={{display:`${forgotPasswordClicked ? 'block' : 'none'}`}}>
                            <form className="formContent" onSubmit={forgotPasswordSubmitHandler}>
                                <p className="gridTopLine">Sign In</p>  
                                <h1 className="gridColumnHeading">Forgot Password</h1>
                                
                                <label htmlFor="email">Email</label> 
                                <input type="text" id="name" placeholder="Enter email" required 
                                    onChange={e => setEmail(e.target.value)}
                                />
                                {
                                    email && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) && <Alert className="emailAlert" severity="error">Enter valid Email ID</Alert>
                                }
                                <button type="submit" className="formBtn">Send Reset Password Link</button>
                                {forgotPasswordSuccess && <Alert severity="success">{forgotPasswordSuccess}</Alert>}
                                {forgotPasswordError && <Alert severity="error">{forgotPasswordError}</Alert>}
                                {
                                    forgotPasswordLoading && 
                                    (
                                        <div className="loadingWrapper">
                                            <ReactLoading type='bars' color={'#01193d'} height={'10%'} width={'10%'} />
                                        </div>
                                    )
                                }
                            </form>
                            <div className="formBottomLine">
                                <span className="formBottomLink" onClick={toggleForgotPasswordClicked}>Know your password?</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="column2">
                        <div className="imageWrap">
                            <img src="/images/svg3.svg" alt="" /> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SigninScreen
