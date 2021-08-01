import Axios from 'axios';
import CryptoJS from 'crypto-js';
import { IMAGE_RETRIEVE_CLEAR, IMAGE_UPLOAD_CLEAR } from './constants/imageConstants';
import { EMAIL_SEND_CLEAR } from './constants/sendEmailConstants';

export const loadPlainImage = (e, setSelectedImageURL, setImageError, setRecipientEmail, setMessage, setSecretKey, setIsEncoded, dispatch) => {
  let reader = new FileReader();
  reader.onload = (event) => {
  let regex = /data:image/;
  if (regex.test(reader.result)) {      //Checks if the uploaded file is an image 
    let dataUrl = event.target.result; 
    document.getElementById('displayImg').style.display='none';
    setRecipientEmail('');
    setSelectedImageURL(dataUrl);
    setImageError(false);
    setMessage('');
    setSecretKey('');
    setIsEncoded('');
    dispatch({type:IMAGE_UPLOAD_CLEAR});
    dispatch({type:EMAIL_SEND_CLEAR});
  } else {
    document.getElementById('selectedImage').value = '';
    alert("Please upload an image!");
  }
  };
  reader.readAsDataURL(e.target.files[0]);
}

export const loadStegoImage = (e, setSelectedImageURL, setStegoImageID, setSecretKey, setDecodedMessage, setIsDecoded, dispatch) => {
  let reader = new FileReader();
  reader.onload = (event) => {
  let regex = /data:image/;
  if (regex.test(reader.result)) {      //Checks if the uploaded file is an image 
    let dataUrl = event.target.result; 
    dispatch({type: IMAGE_RETRIEVE_CLEAR});
    setSelectedImageURL(dataUrl);
    setStegoImageID('');
    setSecretKey('');
    setDecodedMessage('');
    setIsDecoded('');
  } else {
    document.getElementById('selectedImage').value = '';
    alert("Please upload an image!");
  }
};
reader.readAsDataURL(e.target.files[0]);
}

export const encode = async (textToEncrypt, plainSecretKey, setIsEncoded, _id) => {
    //hash secret key
    const secretKey = CryptoJS.SHA256(plainSecretKey).toString(CryptoJS.enc.Hex);
  
    //encrypt text
    let encryptedText = CryptoJS.AES.encrypt(textToEncrypt, secretKey.trim()).toString();

    //get chosen image
    let imageElement = document.getElementById('selectedImage');
    var imgWidth = imageElement.naturalWidth;
    var imgHeight = imageElement.naturalHeight;

    //check if text length is too long to be encoded in the picture
    if (((encryptedText.length+32) * 8) > (imgHeight * imgWidth * 3)) {
      alert("Provided text is too long for this picture");
      return;
    }

    //convert text to binary
    var binaryCode = convertTextToBinary(encryptedText);

    //encode binary code inside the picture
    const stegoImageURL = encodeBinaryIntoImage(binaryCode);
    setIsEncoded("encoded");
    await Axios.post('/api/users/update/numberOfEncodes', {_id});
    return stegoImageURL; 
}

const convertTextToBinary = (cryptoText) => {
    function zeroPad(idx) {
        return "00000000".slice(String(idx).length) + idx;
    }
    return cryptoText.replace(/[\s\S]/g, function(cryptoText) {
        cryptoText = zeroPad(cryptoText.charCodeAt().toString(2));
        return cryptoText;
    });
}

const encodeBinaryIntoImage = (binaryTxt) => {
    //create canvas objects
    var originalCanvas = document.createElement("canvas");
    var newCanvas = document.createElement("canvas");
    //get selected image details
    let selectedImageElement = document.getElementById('selectedImage');
    var canvasWidth = selectedImageElement.naturalWidth;
    var canvasHeight = selectedImageElement.naturalHeight;
    //set canvas dimensions
    originalCanvas.height = canvasHeight;
    originalCanvas.width = canvasWidth;
    newCanvas.height = canvasHeight;
    newCanvas.width = canvasWidth;
    //generate context
    var originalContext = originalCanvas.getContext("2d");
    var newCanvasContext = newCanvas.getContext("2d");
    //set context
    originalContext.drawImage(selectedImageElement, 0, 0);
    //read pixel data
    var origImageData = originalContext.getImageData(0, 0, canvasWidth, canvasHeight);
    var pixelData = origImageData.data;
    //append binary text with 2 empty bytes(start flag)
    binaryTxt = "1000000100000001" + binaryTxt;
    //get binary text length and add space for 2 more empty bytes(16 bits) at the end
    var lengthBinary = Math.ceil(binaryTxt.length/3)*4+16;
    //equalize the data and encode binary message
    var counter = 0;
    for (var i = 0, n = lengthBinary; i < n; i += 4) {
      for (var pixelValue = 0; pixelValue < 3; pixelValue ++) {
        if (counter < binaryTxt.length) {
          if (pixelData[i + pixelValue] %2 !== 0){
            pixelData[i + pixelValue]--;
          }
          pixelData[i + pixelValue] += parseInt(binaryTxt[counter]);
          counter++;
        }
        else {
          //attach empty bytes at the end of the string
          if (pixelData[i + pixelValue] %2 !== 0){
            pixelData[i + pixelValue]--;
          }
        }
      }
    }
    //upload pixels with encoded string to the canvas and convert to png image
    newCanvasContext.putImageData(origImageData, 0, 0);
    newCanvasContext.drawImage(newCanvas, 0, 0, canvasWidth, canvasHeight);
    var newImage = new Image();
    newImage.src = newCanvas.toDataURL("image/png");

    document.getElementById('displayImg').style.display='block';
    //load new picture
    let generatedImageElement = document.getElementById('resultImage');
    generatedImageElement.src = newImage.src;
    
    return newImage.src;
}

// Decoding:
export const decode = async (setIsDecoded, setDecodedMessage, plainSecretKey, _id) => {
    setDecodedMessage('');
    const secretKey = CryptoJS.SHA256(plainSecretKey).toString(CryptoJS.enc.Hex);

    //generate canvas object
    var originalCanvas = document.createElement("canvas");
    let selectedImageElement = document.getElementById('selectedImage');
    var canvasWidth = selectedImageElement.naturalWidth;
    var canvasHeight = selectedImageElement.naturalHeight;
    //set canvas dimensions
    originalCanvas.height = canvasHeight;
    originalCanvas.width = canvasWidth;
    //create context
    var originalContext = originalCanvas.getContext("2d");
    //set context
    originalContext.drawImage(selectedImageElement, 0, 0);
    //get pixel data from the image
    var origImageData = originalContext.getImageData(0, 0, canvasWidth, canvasHeight);
    var pixelData = origImageData.data;
    var binaryTxt = "";
    var stopFlagCount = 0;
    //read binary from the picture
    for (var i = 0, n = pixelData.length; i < n; i += 4) {
      for (var pixelValue =0; pixelValue < 3; pixelValue ++) {
        var bit = 0;
        if(pixelData[i + pixelValue] %2 !== 0) {
          bit = 1;
          //reset end flag counter
          stopFlagCount = 0;
        }
        stopFlagCount += 1;
        binaryTxt += bit;
        //stop reading binary when end flag reached
        if(stopFlagCount>12){
          break;
        }
      }
    }
    //insert a space after every 8 bits
    binaryTxt = binaryTxt.match(/.{1,8}/g).join(" ");
    //convert to arrray
    var newBinary = binaryTxt.split(" ");
    //check for start flag(first 2 empty bits)
    if(newBinary[0]==="10000001" && newBinary[1]==="00000001"){
      //remove the flag from the list
       newBinary.splice(0,2);
    } 
    var binaryCode = [];
    //read data until the first empty byte
    for (i = 0; i < newBinary.length; i++) {
      if(newBinary[i] !== "00000000"){
        binaryCode.push(String.fromCharCode(parseInt(newBinary[i], 2)));
      } else{
        break;
      }
    }
    //get encrypted text
    var encryptedText = binaryCode.join("");

    //decrypt text
    try {
      let decryptedTextMessage = CryptoJS.AES.decrypt(encryptedText, secretKey.trim()).toString(CryptoJS.enc.Utf8);
      if(decryptedTextMessage === "" || decryptedTextMessage === undefined){
        throw "error";
      }
      //display decrypted text
      setDecodedMessage(decryptedTextMessage);
      setIsDecoded('decodeSuccess');
      await Axios.post('/api/users/update/numberOfDecodes', {_id});
    } catch(err){
      setDecodedMessage('');
      setIsDecoded('decodeFail');
    }
}