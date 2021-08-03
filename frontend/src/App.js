import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import Header from './components/Header/Header';
import './App.css';
import Footer from './components/Footer/Footer';
import { BrowserRouter, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import EncodingScreen from './screens/EncodingScreen';
import DecodingScreen from './screens/DecodingScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import Sidebar from './components/Sidebar/Sidebar';
import UserProfileScreen from './screens/UserProfileScreen';
import { Alert as AlertSnackbar } from './components/Alert';
import { AUTHORIZE_FAIL, CHANGE_PASSWORD_SUCCESS, PASSWORD_RESET_SUCCESS, SEND_EMAIL_VERIFICATION_LINK_SUCCESS, USER_REGISTER_SUCCESS, USER_SIGNIN_SUCCESS, USER_SIGNOUT } from './constants/userConstants';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';

function App(props) {
  const [isOpen, setIsOpen] = useState(false); 
  const [headerBg, setHeaderBg] = useState(false);
  const [currentActive, setCurrentActive] = useState('');
  const [data, setData] = useState({});

  const userSignin = useSelector(state => state.userSignin); 
  const userRegister = useSelector(state => state.userRegister);
  const isAuthorized = useSelector(state => state.isAuthorized);
  const sendEmailVerificationLinkState = useSelector(state => state.sendEmailVerificationLink);
  const { sendEmailVerificationLinkMessage } = sendEmailVerificationLinkState;

  const resetPassword = useSelector(state => state.resetPassword); 
  const changePassword = useSelector(state => state.changePassword); 
  
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null
  
  const getData = async () => {
      const {data} = await Axios.get('/api/data');
      setData(data);
  };
  
  const changeNav = () => {
    if(window.location.pathname === '/') {
      if(window.scrollY >= 80) {
        setCurrentActive('home');
        setHeaderBg(true);
      } else {
        setCurrentActive('');
        setHeaderBg(false);
      }
    }
  };

  const toggle = () => {
      setIsOpen(!isOpen);  
  };
  
  useEffect(() => {
    window.addEventListener('scroll', changeNav);
    getData();
  }, []);

  
  return (
    <BrowserRouter>
      <div className="app">
        {userSignin.type===USER_SIGNIN_SUCCESS && userRegister.type !== USER_REGISTER_SUCCESS && <AlertSnackbar message="Signed in successfully." variant="success"/>}
        {userRegister.type===USER_REGISTER_SUCCESS && <AlertSnackbar message="Registered successfully." variant="success"/>}
        {resetPassword.type===PASSWORD_RESET_SUCCESS && <AlertSnackbar message={resetPassword.resetPasswordSuccess} variant="success"/>}
        {changePassword.type===CHANGE_PASSWORD_SUCCESS && <AlertSnackbar message={changePassword.changePasswordSuccess} variant="success"/>}
        {userSignin.type===USER_SIGNOUT && isAuthorized.type!==AUTHORIZE_FAIL && <AlertSnackbar message="Signed out successfully." variant="success"/>}
        {isAuthorized.type===AUTHORIZE_FAIL && <AlertSnackbar variant="error" message="Your session has been expired please sign in again." />}
        {sendEmailVerificationLinkState.type===SEND_EMAIL_VERIFICATION_LINK_SUCCESS && <AlertSnackbar message={sendEmailVerificationLinkMessage} variant="success"/>}

        <nav>
            <Sidebar userInfo={userInfo} location={props.location} isOpen={isOpen} toggle={toggle} currentActive={currentActive}/>
            <Header userInfo={userInfo} location={props.location} toggle={toggle} headerBg={headerBg} currentActive={currentActive} />
        </nav>
        <main>
            <Route path="/changepassword" render={(props) => 
              <ChangePasswordScreen history={props.history} headerBg={headerBg} setHeaderBg={setHeaderBg} currentActive={currentActive} setCurrentActive={setCurrentActive}/>}
            ></Route>
            <Route path="/resetpassword/:token" render={(props) => 
              <ResetPasswordScreen location={props.location} history={props.history} headerBg={headerBg} setHeaderBg={setHeaderBg} currentActive={currentActive} setCurrentActive={setCurrentActive}/>}
            ></Route>
            <Route path="/userprofile/:id" render={(props) => 
              <UserProfileScreen history={props.history} headerBg={headerBg} setHeaderBg={setHeaderBg} currentActive={currentActive} setCurrentActive={setCurrentActive}/>}
            ></Route>
            <Route path="/encoding" render={(props) => 
              <EncodingScreen history={props.history} data={data} headerBg={headerBg} setHeaderBg={setHeaderBg} currentActive={currentActive} setCurrentActive={setCurrentActive}/>} 
            ></Route>
            <Route path="/decoding" render={(props) => 
              <DecodingScreen location={props.location} history={props.history} data={data} headerBg={headerBg} setHeaderBg={setHeaderBg} currentActive={currentActive} setCurrentActive={setCurrentActive} />}
            ></Route>
            <Route path="/verifyemail/:token" render={(props) => 
              <VerifyEmailScreen location={props.location} headerBg={headerBg} setHeaderBg={setHeaderBg} currentActive={currentActive} setCurrentActive={setCurrentActive}/>} 
            ></Route>
            <Route path="/signin" render={(props) => 
              <SigninScreen userInfo={userInfo} location={props.location} history={props.history} headerBg={headerBg} setHeaderBg={setHeaderBg} currentActive={currentActive} setCurrentActive={setCurrentActive}/>} 
            ></Route>
            <Route path="/signup" render={(props) => 
              <SignupScreen userInfo={userInfo} location={props.location} history={props.history} headerBg={headerBg} setHeaderBg={setHeaderBg} currentActive={currentActive} setCurrentActive={setCurrentActive}/>}
            ></Route>
            <Route path="/" render={() => 
              <HomeScreen userInfo={userInfo} data={data} setHeaderBg={setHeaderBg} changeNav={changeNav} setCurrentActive={setCurrentActive}/>} exact
            ></Route>
        </main>
        <footer>
            <Footer />
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
