import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import CryptoJS from 'crypto-js';
import Users from './userModel.js';
import { createRandomToken, generateToken, isAuth, sendEmail, verifyGoogleSignin } from './utils.js';
import Hogan from 'hogan.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userRouter = express.Router();

var welcomeTemplate = fs.readFileSync(path.join(__dirname, './templates/welcome.html'), 'utf-8');
var verifyEmailTemplate = fs.readFileSync(path.join(__dirname, './templates/verifyemail.html'), 'utf-8');
var resetPasswordTemplate = fs.readFileSync(path.join(__dirname, './templates/resetpassword.html'), 'utf-8');

var compiledWelcomeTemplate = Hogan.compile(welcomeTemplate);
var compiledVerifyEmailTemplate = Hogan.compile(verifyEmailTemplate);
var compiledResetPasswordTemplate = Hogan.compile(resetPasswordTemplate);


userRouter.post(
    '/signin',
    expressAsyncHandler( async (req, res) => {
        const user = await Users.findOne({email: req.body.email});
        if(!user) {
            return res.status(404).send("User doesn't exist.");
        }
        if(req.body.password === user.password){
            return res.send({
                token: await generateToken(user)
            });
        } 
        return res.status(401).send("Invalid Email ID or Password")
    })
);

userRouter.post(
    '/googlesignin',
    verifyGoogleSignin, 
    expressAsyncHandler( async (req, res) => {
        console.log(req.user);
        const user = await Users.findOne({email: req.user.email});
        if(user) {
            return res.send({
                token: await generateToken(user)
            });
        }
        const {randomTokenHashed} = createRandomToken();
        const newUser = new Users({
            name: req.user.name, 
            email: req.user.email, 
            password: randomTokenHashed, 
            isVerified: req.user.email_verified
        });
        try {
            const createdUser = await newUser.save();
            const mailOptions = {
                from: `CryptoStego <${process.env.HOST}>`,
                to: createdUser.email,
                subject: 'Welcome to CryptoStego',
                html: compiledWelcomeTemplate.render({name: createdUser.name, cryptoStegoLink:"http://localhost:3000"})
            };
            sendEmail(mailOptions);
            res.send({
                token: await generateToken(createdUser)
            })
        } catch(error){
            res.status(400).send("Something went wrong.");
        }
    })
)

userRouter.post(
    '/register',
    expressAsyncHandler( async(req,res) => {
        if(await Users.findOne({email: req.body.email})){
            res.status(409).send("User already exists.");
        }
        const user = new Users({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        try{
            const createdUser = await user.save(); //Now data is saved in mongo db
            const mailOptions = {
                from: `CryptoStego <${process.env.HOST}>`,
                to: createdUser.email,
                subject: 'Welcome to CryptoStego',
                html: compiledWelcomeTemplate.render({name: createdUser.name, cryptoStegoLink:"http://localhost:3000"})
            };
            sendEmail(mailOptions);
            res.send({
                token: await generateToken(createdUser)
            })
            return;
        } catch(err) {
            res.status(400).send("Something went wrong.");
        }
    })
);

userRouter.post(
    '/sendverificationemail',
    expressAsyncHandler( async (req, res) => {
        const user = await Users.findOne({email: req.body.email});
        const {randomTokenHashed, randomToken} = createRandomToken();
        user.verifyEmailToken = randomTokenHashed;
        user.verifyEmailTokenExpires = Date.now() + 10 * 60 * 1000;  //Expires in 10 minutes
        await user.save();
        const resetURL = `http://localhost:3000/verifyemail/${randomToken}`;
        const mailOptions = {
            from: `CryptoStego <${process.env.HOST}>`,
            to: req.body.email,
            subject: 'Verify your email',
            html: compiledVerifyEmailTemplate.render({name: user.name, verifyEmailLink: resetURL})
        };
        const result = await sendEmail(mailOptions);
        if(result) {
            res.status(200).send("Email verification link has been sent to your email.");
        } else {
            user.verifyEmailToken = undefined;
            user.verifyEmailTokenExpires = undefined;
            await user.save();
            res.status(400).send("Error in sending email verification link.");
        }
    })
);

userRouter.patch(
    '/emailverification/:token',
    expressAsyncHandler( async (req, res) => {
        const hashedToken = CryptoJS.SHA256(req.params.token).toString(CryptoJS.enc.Hex);
        const user = await Users.findOne({
            verifyEmailToken: hashedToken,
            verifyEmailTokenExpires: { $gt: Date.now() }
        });
        if(!user) {
            return res.status(400).send('Email verification link is invalid or expired');
        }
        user.isVerified = true;
        user.verifyEmailToken = undefined;
        user.verifyEmailTokenExpires = undefined;
        await user.save();
        res.status(200).send("Email verified successfully");
    })
);

userRouter.post(
    '/forgotpassword',
    expressAsyncHandler( async (req,res) => {
        const user = await Users.findOne({email: req.body.email});
        if(!user){
            return res.status(404).send("User doesn't exist.");
        }
        const {randomTokenHashed, randomToken} = createRandomToken();
        user.passwordResetToken = randomTokenHashed;
        user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;  //Expires in 10 minutes
        await user.save();
        const resetURL = `http://localhost:3000/resetpassword/${randomToken}`;
        const mailOptions = {
            from: `CryptoStego <${process.env.HOST}>`,
            to: req.body.email,
            subject: 'Reset Password Link',
            html: compiledResetPasswordTemplate.render({name: user.name, resetPasswordLink: resetURL})
        };
        const result = await sendEmail(mailOptions);
        if(result) {
            res.status(200).send("Reset password link has been sent to your email.");
        } else {
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpires = undefined;
            await user.save();
            res.status(400).send("Error in sending reset password link.");
        }
    })
);

userRouter.patch(
    '/resetpassword/:token',
    expressAsyncHandler( async (req, res) => {
        const hashedToken = CryptoJS.SHA256(req.params.token).toString(CryptoJS.enc.Hex);
        const user = await Users.findOne({
            passwordResetToken: hashedToken,
            passwordResetTokenExpires: { $gt: Date.now() }
        });
        if(!user) {
            return res.status(400).send('Password reset link is invalid or expired');
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save();
        res.status(200).send("Password reset successfully");
    })
);

userRouter.patch(
    '/changepassword',
    expressAsyncHandler( async (req, res) => {
        const user = await Users.findOne({_id : req.body._id});
        if(req.body.oldPassword !== user.password) {
            return res.status(400).send("Invalid old password");
        }
        user.password = req.body.newPassword;
        await user.save();
        res.send("Password changed successfully.");
    })
)

userRouter.post(
    '/update/:type',
    expressAsyncHandler( async (req,res) => {
        try {
            if(req.params.type === 'numberOfEncodes'){
                const user = await Users.findOne({_id : req.body._id});
                user.numberOfEncodes += 1;
                await user.save();
            } else{
                const user = await Users.findOne({_id : req.body._id});
                user.numberOfDecodes += 1;
                await user.save();
            }
            res.send("success");
        } catch(error) {
            res.status(400).send("Error in updating");
        }
    })
)

userRouter.get(
    '/userinfo',
    isAuth,
    expressAsyncHandler( async (req, res) => {
        const user = await Users.findOne({_id: req.user._id});
        res.send({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            isVerified: user.isVerified,
            numberOfEncodes : user.numberOfEncodes,
            numberOfDecodes : user.numberOfDecodes
        });
    })
);

export default userRouter;