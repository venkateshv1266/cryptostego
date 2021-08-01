import React, {useEffect, useState} from 'react';
import CryptoJS from 'crypto-js';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {animateScroll as scroll} from 'react-scroll';
import ReactLoading from 'react-loading';
import { register } from '../actions/userActions';
import {Alert as AlertSnackbar} from '../components/Alert';
import { Alert } from '@material-ui/lab';
import { AUTHORIZE_SUCCESS, USER_SIGNIN_SUCCESS } from '../constants/userConstants';

function SignupScreen(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const redirect = props.location.search
        ? props.location.search.split('=')[1]
        : '/';

    const userRegister = useSelector(state => state.userRegister); 
    const userSignin = useSelector(state => state.userSignin); 
    const isAuthorized = useSelector(state => state.isAuthorized); 
    const { error } = userRegister;

    const dispatch = useDispatch();
    const submitHandler = async (e) => {
        e.preventDefault();
        if(password===confirmPassword && (/^(?=.*[0-9])(?=.*[!@#$%^&*'])[a-zA-Z0-9!@#$%^&*']{6,16}$/.test(password))){
            const hashDigest = CryptoJS.SHA256(password);
            const hashedPassword = hashDigest.toString(CryptoJS.enc.Hex);
            dispatch(register(name,email.trim(),hashedPassword));
        }
    }
    useEffect(() => {
        if(userSignin.type === USER_SIGNIN_SUCCESS && isAuthorized.type === AUTHORIZE_SUCCESS) {
            props.history.push(redirect);
        } 
        props.setHeaderBg(true);
        props.setCurrentActive('signup');
        scroll.scrollToTop();
    },[props.currentActive, isAuthorized.type , props.history, redirect]);
    return (
        <div className="signupContainer">
            <div className="gridContainer">
                <div className="gridWrapper gridWrapperSigninSignup">
                    <div className="column1">
                        <form className="formContent" onSubmit={submitHandler}>
                            <p className="gridTopLine">Sign Up</p>
                            <h1 className="gridColumnHeading">Create your account</h1>
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" placeholder="Enter name" required onChange={e => setName(e.target.value)}/>
                            
                            <label htmlFor="email">Email</label> 
                            <input type="email" id="email" placeholder="Enter email" required onChange={e => setEmail(e.target.value)}/>
                            {
                                email && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) && <Alert className="emailAlert" severity="error">Enter valid Email ID</Alert>
                            }
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" placeholder="Enter password" required onChange={e => setPassword(e.target.value)}/>
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
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" placeholder="Enter confirm password" required onChange={e => setConfirmPassword(e.target.value)}/>
                            {
                                password!==confirmPassword && <Alert severity="error">Password and confirm password should be same.</Alert>
                            }
                            <button type="submit" className="formBtn">Sign Up</button>
                            {
                                error && <AlertSnackbar message={error} variant="error"/>
                            }
                        </form>
                        {
                            userRegister.loading || isAuthorized.loading && 
                            (
                                <div className="loadingWrapper">
                                    <ReactLoading type='bars' color={'#01193d'} height={'10%'} width={'10%'} />
                                </div>
                            )
                        }
                        <div className="formBottomLine">
                            <span className="formBottomText">Already have an account?</span>
                            <Link className="formBottomLink" to="/signin">Sign In</Link>
                        </div>
                    </div>
                    
                    <div className="column2">
                        <div className="imageWrap">
                            <img src="/images/svg2.svg" alt="" /> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupScreen
