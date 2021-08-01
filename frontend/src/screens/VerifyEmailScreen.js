import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import { Checkmark } from 'react-checkmark';
import { isEmailVerified } from '../actions/userActions';

function VerifyEmailScreen(props) {
    const dispatch = useDispatch();

    const token = (props.location.pathname).slice(13, (props.location.pathname).length); 

    const isEmailVerifiedState = useSelector(state => state.isEmailVerified);

    useEffect(() => {
        dispatch(isEmailVerified(token));
        props.setCurrentActive('');
        props.setHeaderBg(true);
    }, [props.currentActive]);

    return (
        <div>
            {
                isEmailVerifiedState.loading ?
                (
                    <div className="loadingWrapper">
                        <ReactLoading type='bars' color={'#01193d'} height={'30%'} width={'30%'} />
                    </div>
                )
                : isEmailVerifiedState.error ? 
                (
                    <div className="verifyEmailContainer">
                        <div className="crossmark">
                            ✖
                        </div>
                        <span>{isEmailVerifiedState.error}</span>
                    </div>
                )
                : isEmailVerifiedState.isEmailVerifiedMessage &&
                (
                    <div className="verifyEmailContainer">
                        <div>
                            <Checkmark size='150px'/>
                        </div>
                        
                        <span>{isEmailVerifiedState.isEmailVerifiedMessage}</span>
                    </div>
                )
            }
        </div>
    )
}

export default VerifyEmailScreen
