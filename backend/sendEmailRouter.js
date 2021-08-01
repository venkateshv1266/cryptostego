import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
import { sendEmail } from './utils.js';
import Hogan from 'hogan.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var template = fs.readFileSync(path.join(__dirname, './templates/encodedmessage.html'), 'utf-8');
var compiledTemplate = Hogan.compile(template);


dotenv.config();

const sendEmailRouter = express.Router();

sendEmailRouter.post(
    '/sendmail',
    expressAsyncHandler( async (req, res) => {
        const secretKey = CryptoJS.AES.decrypt(req.body.secretKey, 'this-is-my-ultra-large-secret-key!!!').toString(CryptoJS.enc.Utf8);
        const mailOptions = {
            to: req.body.recipientEmail,
            from: `CryptoStego <${process.env.HOST}>`,
            subject: 'Encoded Message', 
            text: 'Encoded Message',
            html: compiledTemplate.render({secretKey, stegoImageID: req.body.stegoImageID, cryptoStegoLink:"http://localhost:3000"})
        };

        const result = await sendEmail(mailOptions);
        if(result) {
            res.status(200).send("Email sent successfully.");
        } else {
            res.status(400).send("Error in sending email");
        }
    })
)

export default sendEmailRouter;