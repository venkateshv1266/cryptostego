import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import Video from '../videos/video (1).mp4';
import './index.css';
import {animateScroll as scroll} from 'react-scroll';

function HomeScreen(props) {

    useEffect(() => {
        props.changeNav();
        scroll.scrollToTop();
    },[props.headerBg]);

    return (
        <div className="homeContainer">
            <div className="bannerContainer">
                <div className="bgVideo">
                    <video autoPlay loop muted type="video/mp4" src={Video} ></video>
                </div>
                <div className="bannerContent">
                    <img className="logoImgBanner" src="images/CryptoStegoLogo1.png" alt="CryptoStegoLogo" />
                    <h1 className="bannerH1">{props.data.appName}</h1>
                    <p className="bannerP">{props.data.subTitle}</p>
                    <Link 
                        className="btn" 
                        to={props.userInfo ? `/userprofile/${props.userInfo._id}` : '/signup'}
                    >
                        {props.userInfo ? 'Hi, '+props.userInfo.name : 'Get Started'}
                    </Link> 
                </div>  
            </div>
            <div className="gridContainer">
                <div className="gridWrapper">
                    <div className="column1">
                        <div className="aboutContent">
                            <p className="gridTopLine">About</p>
                            <h1 className="gridColumnHeading">{props.data.aboutHeading}</h1>
                            <p className="aboutP">{props.data.aboutContent}</p>
                        </div>
                    </div>
                    <div className="column2">
                        <div className="imageWrap">
                            <img src="/images/svg1.svg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeScreen;