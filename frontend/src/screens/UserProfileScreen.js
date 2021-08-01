import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {animateScroll as scroll} from 'react-scroll';
import ReactLoading from 'react-loading';
import {Link} from 'react-router-dom';
import { Checkmark } from 'react-checkmark';
import { isAuthorizedUser, sendEmailVerificationLink } from '../actions/userActions';
import { AUTHORIZE_FAIL } from '../constants/userConstants';

function UserProfileScreen(props) {
    const [isAuthorizedLoading, setIsAuthorizedLoading] = useState(true);
    const dispatch = useDispatch(); 

    const isAuthorized = useSelector(state => state.isAuthorized); 
    const {userInfo = isAuthorized.authorizedUserInfo, type} = isAuthorized;

    const sendEmailVerificationLinkState = useSelector(state => state.sendEmailVerificationLink);
    const { loading } = sendEmailVerificationLinkState;

    const sendVerificationLink = () => {
        dispatch(sendEmailVerificationLink());
    }

    useEffect(() => {
        dispatch(isAuthorizedUser(setIsAuthorizedLoading));
        props.setCurrentActive('user');
        props.setHeaderBg(true);
        scroll.scrollToTop();
    }, [props.currentActive]);

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
                    <div className="userProfileContainer">
                        <div className="gridContainer">
                            <div className="gridWrapper gridWrapperUserProfile">
                                <div className="column1 column1UserProfile">
                                    <p className="gridTopLine">Info</p>
                                    <h1 className="gridColumnHeading">User Profile</h1>

                                    <div className="userProfileDataWrapper">
                                        <div className="userProfileData">
                                            <label>User ID</label>
                                            <span>{userInfo._id}</span>
                                        </div>
                                        <div className="userProfileData">
                                            <label>Name</label>
                                            <span>{userInfo.name}</span>
                                        </div>
                                        <div className="userProfileData">
                                            <label>Email</label>
                                            <div className="userProfileDataEmail">
                                                <span className="verifiedUser">
                                                    <span>{userInfo.email}</span> 
                                                    {userInfo.isVerified && <Checkmark className="checkmark" size='small'/>}
                                                </span>
                                                
                                                {
                                                    !userInfo.isVerified &&
                                                        (
                                                            <span className="notVerifiedUserWrapper">
                                                                <span className="notVerifiedUser">Not Verified</span>
                                                                <span className="sendVerificationLink" onClick={sendVerificationLink}>Send Verification Link</span>
                                                            </span>
                                                        )
                                                }
                                            </div>
                                        </div>
                                        {
                                            loading && 
                                            (
                                                <div className="loadingWrapper">
                                                    <ReactLoading type='bars' color={'#01193d'} height={'10%'} width={'10%'} />
                                                </div>
                                            )
                                        }
                                        
                                        <div className="userProfileData">
                                            <label>Number of Encodes</label>
                                            <span>{userInfo.numberOfEncodes}</span>
                                        </div>
                                        <div className="userProfileData">
                                            <label>Number of Decodes</label>
                                            <span>{userInfo.numberOfDecodes}</span>
                                        </div>

                                        <div className="changePasswordLinkWrapper">
                                            <Link className="changePasswordLink" to="/changepassword">Change password</Link>
                                        </div>
                                    </div>
                                    
                                    
                                    
                                </div>
                                
                                
                                <div className="column2 column2UserProfile">
                                    <div className="imageWrap">
                                        <img src="/images/svg5.svg" alt="" /> 
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

export default UserProfileScreen
