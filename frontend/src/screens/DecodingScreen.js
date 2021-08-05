import React, {useEffect, useState} from 'react'; 
import { decode, loadStegoImage } from '../steganography';
import {animateScroll as scroll} from 'react-scroll';
import ReactLoading from 'react-loading';
import { Alert } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveImage } from '../actions/imageActions';
import { IMAGE_RETRIEVE_CLEAR } from '../constants/imageConstants';
import { isAuthorizedUser } from '../actions/userActions';
import { AUTHORIZE_FAIL } from '../constants/userConstants';

function DecodingScreen(props) {
    const [stegoImageID, setStegoImageID] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [isDecoded, setIsDecoded] = useState('');
    const [decodedMessage, setDecodedMessage] = useState('');
    const [error, setError] = useState(false);
    const [selectedImageURL, setSelectedImageURL] = useState("/images/blankimage.jpg");
    const [isAuthorizedLoading, setIsAuthorizedLoading] = useState(true);

    const dispatch = useDispatch();

    const retrieveImageState = useSelector(state => state.retrieveImage);
    const { stegoImage, retrieveImageLoading = retrieveImageState.loading } = retrieveImageState;
    
    stegoImage && stegoImage.stegoImageURL && selectedImageURL!==stegoImage.stegoImageURL && setSelectedImageURL(stegoImage.stegoImageURL) 
    error && selectedImageURL!=="/images/blankimage.jpg" && setSelectedImageURL("/images/blankimage.jpg")

    const isAuthorized = useSelector(state => state.isAuthorized); 
    const {type, authorizedUserInfo} = isAuthorized;

    

    const submitHandler = (e) => {
        e.preventDefault();
        if(selectedImageURL!=="/images/blankimage.jpg"){
            setError(false);
            decode(setIsDecoded, setDecodedMessage, secretKey, isAuthorized.authorizedUserInfo._id);
        } else {
            setError(true);
        }
        
    }
    useEffect(() => {
        dispatch(isAuthorizedUser(setIsAuthorizedLoading));
        setIsDecoded('');
        dispatch({type:IMAGE_RETRIEVE_CLEAR});
        if(selectedImageURL !== "/images/blankimage.jpg"){
            setSelectedImageURL("/images/blankimage.jpg");
        }
        if((props.location.pathname).length > 9){
            setStegoImageID((props.location.pathname).slice(10, (props.location.pathname).length));
            dispatch(retrieveImage(stegoImageID));
        }
        props.setHeaderBg(true);
        props.setCurrentActive('decoding');
        scroll.scrollToTop();
    },[props.headerBg, props.currentActive]);
    
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
                : !authorizedUserInfo.isVerified ? 
                (
                    <div className="verifyEmailContainer">
                        <div className="importantMark">
                            !
                        </div>
                        <span>Please verify your email from user profile screen.</span>
                    </div>
                )
                :(
                    <div className="decodingContainer">
                        <div className="gridTopParagraphWrapper">
                            <p className="gridTopParagraph">{props.data.decodingContent}</p>
                            <p className="gridTopParagraph">{props.data.decodingNoteContent}</p>
                        </div>

                        <div className="gridContainer">
                            <div className="gridWrapper gridWrapperDecode">
                                <div className="column1 column1EncodeDecode">
                                    <form className="formContent" onSubmit={submitHandler}>
                                        <p className="gridTopLine">Decode</p>
                                        <h1 className="gridColumnHeading">CryptoStego - Decoding</h1>

                                        <label htmlFor="stegoImageId">Stego Image ID </label>
                                        <input type="text" id="stegoImageId" placeholder="Enter stego image id (Optional)" value={stegoImageID}
                                            onChange={ (e) => {
                                                setStegoImageID(e.target.value)
                                                dispatch(retrieveImage(e.target.value))
                                            }}
                                        
                                        />
                                        {
                                            stegoImageID && retrieveImageLoading && 
                                            (
                                                <div className="loadingWrapper">
                                                    <ReactLoading type='bars' color={'#01193d'} height={'10%'} width={'10%'} />
                                                </div>
                                            )
                                        }
                                        {
                                            stegoImage && <Alert className="alertDecodingScreen" severity="success">Stego Image Found</Alert>
                                        }
                                        {
                                            retrieveImageState.error && <Alert className="alertDecodingScreen" severity="error">{retrieveImageState.error}</Alert>
                                        }
                                        <label htmlFor="secretkey">Secret key </label>
                                        <input type="password" id="secretkey" placeholder="Enter secret key" value={secretKey} onChange={ (e) => setSecretKey(e.target.value)}/>

                                        <button type="submit" className="formBtn">Decode</button>
                                        
                                        {error && <Alert className="alertDecodingScreen" severity="error">Error: Please select an image.</Alert>}
                                        {
                                            isDecoded &&
                                                isDecoded==='decodeSuccess' 
                                                    ? <Alert className="alertDecodingScreen" severity="success">Message decoded successfully</Alert>
                                                    : isDecoded==='decodeFail' && <Alert className="alertDecodingScreen" severity="error">Error: Either the selected image doesn't contain the message or invalid secret key.</Alert>
                                        }
                                        <div className="message">
                                            <label htmlFor="message">Message encoded inside the image</label>
                                            <textarea id="message" readOnly value={decodedMessage}></textarea>
                                        </div>
                                    </form>
                                    
                                </div>
                                <div className="column2 column2EncodeDecode">
                                    <div className="imageWrap imageWrapEncodeDecode">
                                        <button className="formBtn uploadBtn" htmlFor="upload-image" variant="contained" component="span">
                                            <label className="uploadLabel" htmlFor="upload-image" >
                                                <input
                                                    style={{ display: 'none' }}
                                                    id="upload-image"
                                                    name="upload-image"
                                                    type="file"
                                                    onChange={(e) => {
                                                        loadStegoImage(e, setSelectedImageURL, setStegoImageID, setSecretKey, setDecodedMessage, setIsDecoded, dispatch);
                                                    }}
                                                />
                                                Upload Stego Image
                                            </label>
                                        </button>
                                        
                                        <label htmlFor="selectedImage">Stego Image</label>
                                        <img id="selectedImage" src={selectedImageURL} alt="" /> 
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

export default DecodingScreen
