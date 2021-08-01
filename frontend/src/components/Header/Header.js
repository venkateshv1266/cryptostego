import React from 'react';
import {Link} from 'react-router-dom';
import { FaBars } from 'react-icons/fa'
import './Header.css';
import { useDispatch } from 'react-redux';
import { signout } from '../../actions/userActions';

function Header(props) {  
    const dispatch = useDispatch();

    const signOutHandler = () => {
        dispatch(signout());
    }

    return (
        <div className={`headerContainer ${props.headerBg ? 'changeBgColor' : 'changeBgColorTransparent'}`}>
            
            <Link className="logo" to="/">
                <div className="logo">
                    <img className="logoImg" src="/images/CryptoStegoLogo1.png" alt="CryptoStegoLogo" />
                    <span className="logo">CryptoStego</span>
                </div>
            </Link>
            <div className="navIcon" onClick={props.toggle}>
                <FaBars />
            </div>
            
            <div className="navMenu">
                <div className={`${props.currentActive==='home' ? 'active' : ''} navItem`} >
                    <Link className="navLink" to="/">Home</Link>
                </div>
                <div className={`${props.currentActive==='encoding' ? 'active' : ''} navItem`}>
                    <Link 
                        className="navLink" 
                        to={props.userInfo ? '/encoding' : '/signin?redirect=encoding'}
                    >
                        Encoding
                    </Link>
                </div>
                <div className={`${props.currentActive==='decoding' ? 'active' : ''} navItem`}>
                    <Link 
                        className="navLink" 
                        to={props.userInfo ? '/decoding' : '/signin?redirect=decoding'}
                    >
                        Decoding
                    </Link>
                </div>
                <div className={`${props.currentActive==='signup' || props.currentActive==='user' ? 'active' : ''} navItem`}>
                    <Link 
                        className="navLink" 
                        to={props.userInfo ? `/userprofile/${props.userInfo._id}` : '/signup'}
                    >
                        {props.userInfo ? props.userInfo.name : 'Sign Up'}
                    </Link>                
                </div>
            </div>
            {
                props.userInfo 
                    ? <Link className="navBtn" to ="/#" onClick={signOutHandler}>Sign Out</Link>
                    : <Link className="navBtn" to="/signin">Sign In</Link>
            }
            
        </div>
    )
}

export default Header;
