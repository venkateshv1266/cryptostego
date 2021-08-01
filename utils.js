import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer';
// import {google} from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import sgMail from '@sendgrid/mail';

export const generateToken = async (createdUser) => {
    const token = jwt.sign(
        { 
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
    return token;
};

export const isAuth = async (req,res,next) => {
    // 1) Getting token and check if it's exist
    const authorization = req.headers.authorization;
    // 2) Verification token
    if(authorization) {
        //Sample token: "CryptoStego XXXXX...." Here first 7 character will be sliced and remaining token value is returned
        const token = authorization.slice(12, authorization.length);
        
        //This decodes the token and assigns it to req.user
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if(err){
                res.status(401).send("Your session has expired please sign in to continue.");
            } else {
                req.user = decode;
                next();
            }
        });

    } else {
        res.status(401).send("Sign in to continue.");
    }
};


export const sendEmail = async (mailOptions) => {
    try{
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const result = await sgMail.send(mailOptions);
        // const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
        // oAuth2Client.setCredentials({
        //     refresh_token: process.env.REFRESH_TOKEN
        // });
        
        // const accessToken = await oAuth2Client.getAccessToken();
        // const transport = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         type: 'OAuth2',
        //         user: process.env.HOST,
        //         clientId: process.env.CLIENT_ID,
        //         clientSecret: process.env.CLIENT_SECRET,
        //         refreshToken: process.env.REFRESH_TOKEN,
        //         accessToken: accessToken
        //     }
        // });
        // const result = await transport.sendMail(mailOptions);
        
        return result;
    } catch (error) {
        console.log(error);
        return
    }
};

export const createRandomToken = () => {
    const randomToken = crypto.randomBytes(32).toString('hex');
    const randomTokenHashed = CryptoJS.SHA256(randomToken).toString(CryptoJS.enc.Hex);
    return {randomTokenHashed, randomToken};
}


export const verifyGoogleSignin = async (req, res, next) => {
    const client = new OAuth2Client(process.env.GOOGLESIGNIN_CLIENT_ID);
    try {
        const response = await client.verifyIdToken({
            idToken: req.body.tokenId,
            audience: process.env.GOOGLESIGNIN_CLIENT_ID
        });
        req.user = response.payload;
        next();
    } catch(error) {
        res.status(400).send("Something went wrong.")
    }
}