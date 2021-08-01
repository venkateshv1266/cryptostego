import React, {useState, useEffect} from 'react';
import { loadPlainImage, encode } from '../steganography';
import {animateScroll as scroll} from 'react-scroll';
import { Alert } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage } from '../actions/imageActions';
import ReactLoading from 'react-loading';
import { IMAGE_UPLOAD_CLEAR } from '../constants/imageConstants';
import { EMAIL_SEND_CLEAR } from '../constants/sendEmailConstants';
import { AUTHORIZE_FAIL } from '../constants/userConstants';
import { isAuthorizedUser } from '../actions/userActions';

function EncodingScreen(props) { 
    const [message, setMessage] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [isEncoded, setIsEncoded] = useState('');
    const [selectedImageURL, setSelectedImageURL] = useState("/images/blankimage.jpg");
    const [error, setError] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isAuthorizedLoading, setIsAuthorizedLoading] = useState(true);

    const dispatch = useDispatch();
    const uploadImageState = useSelector(state => state.uploadImage);
    const {stegoImage, uploadImageError = uploadImageState.error, uploadImageLoading = uploadImageState.loading} = uploadImageState;

    const sendEmailState = useSelector(state => state.sendEmail);
    const {sendEmailResponse, sendEmailError = sendEmailState.error, sendEmailLoading = sendEmailState.loading} = sendEmailState;

    const isAuthorized = useSelector(state => state.isAuthorized); 
    const {type, authorizedUserInfo} = isAuthorized;

    const submitHandler = async (e) => {
        e.preventDefault();
        if(selectedImageURL === "/images/blankimage.jpg"){
            setImageError(true);
            return;
        }
        if(!recipientEmail){
            dispatch({type:EMAIL_SEND_CLEAR});
        }
        if(message && secretKey){
            setError(false);
            setImageError(false);
            const stegoImageURL = await encode(message, secretKey, setIsEncoded, isAuthorized.authorizedUserInfo._id);
            dispatch(uploadImage(stegoImageURL, recipientEmail, secretKey));
        } else {
            setError(true);
        }
    }

    useEffect(() => {
        dispatch(isAuthorizedUser(setIsAuthorizedLoading));
        dispatch({type:IMAGE_UPLOAD_CLEAR});
        dispatch({type:EMAIL_SEND_CLEAR});
        props.setHeaderBg(true);
        props.setCurrentActive('encoding');
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
                :
                (
                    <div className="encodingContainer">
                        <div className="gridTopParagraphWrapper">
                            <p className="gridTopParagraph">{props.data.encodingContent}</p>
                            <p className="gridTopParagraph">{props.data.encodingNoteContent}</p>
                        </div>

                        <div className="gridContainer">
                            <div className="gridWrapper ">
                                <div className="column1 column1EncodeDecode">
                                    <form className="formContent" onSubmit={submitHandler}>
                                        <p className="gridTopLine">Encode</p>
                                        <h1 className="gridColumnHeading">CryptoStego - Encoding</h1>

                                        <label htmlFor="recipientEmail">Recipient Email</label>
                                        <input type="text" id="recipientEmail" placeholder="Enter recipient email (Optional)" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)}/>

                                        <div className="message messageAtEncode">
                                            <label htmlFor="message">Message</label>
                                            <textarea id="message" placeholder="Enter message to be encoded" value={message} onChange={e => setMessage(e.target.value)}></textarea>
                                        </div>
                                        
                                        <label htmlFor="secretkey">Secret key</label>
                                        <input type="text" id="secretkey" placeholder="Enter secret key" value={secretKey} onChange={e => setSecretKey(e.target.value)}/>

                                        <button type="submit" className="formBtn">Encode</button>
                                        
                                        {isEncoded && isEncoded==="encoded" && <Alert severity="success">Message encoded successfully.</Alert>}
                                        {error && <Alert severity="error">Error: Please enter the message or secret key.</Alert>}
                                        {imageError && <Alert severity="error">Error: Please select an image.</Alert>}
                                        {uploadImageError && <Alert severity="error">{uploadImageError}</Alert>}
                                        {stegoImage && <Alert severity="success">Stego Image ID: {stegoImage._id}</Alert> }

                                        {sendEmailResponse && <Alert severity="success">{sendEmailResponse}</Alert>}
                                        {sendEmailError && <Alert severity="error">{sendEmailError}</Alert>}
                                    
                                        {
                                            (uploadImageLoading || sendEmailLoading) && 
                                            (
                                                <div className="loadingWrapper">
                                                    <ReactLoading type='bars' color={'#01193d'} height={'10%'} width={'10%'} />
                                                </div>
                                            )
                                        }
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
                                                    onChange={(e) => loadPlainImage(e, setSelectedImageURL, setImageError, setRecipientEmail, setMessage, setSecretKey, setIsEncoded, dispatch)}
                                                />
                                                Upload Image
                                            </label>
                                        </button>
                                        <label>Image size less than 1MB is more efficient.</label>
                                        <img id="selectedImage" src={selectedImageURL} alt="" /> 
                                        <div id="displayImg">
                                            <label>Right-click to save this image:</label>
                                            <img src="" alt="" id="resultImage"/>
                                        </div>
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

export default EncodingScreen
