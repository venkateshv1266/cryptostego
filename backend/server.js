import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import data from './data.js';
import imageRouter from './imageRouter.js';
import userRouter from './userRouter.js';
import sendEmailRouter from './sendEmailRouter.js';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//To read the content of .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//Must include this middleware in order to parse the data in frontend.
app.use(express.json({limit: '500mb'})); 
app.use(express.urlencoded({ extended: true, limit: '500mb'}));

app.use(express.static(path.join(__dirname, '/frontend/build'))); //to serve the frontend files
app.get('*', (req,res) => res.sendFile(path.join(__dirname, '/frontend/build/index.html')));

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use('/api/users', userRouter);
app.use('/api/images', imageRouter);
app.use('/api', sendEmailRouter);

app.get('/api/data', (req,res) => {
    res.send(data);
});

<<<<<<< HEAD:backend/server.js
// app.get('/', (req, res) => {
//     res.status(200).send(`Server Connected at PORT ${process.env.PORT}`);
// });
=======
app.get('/', (req, res) => {
    res.status(200).send(`Server Connected at PORT ${process.env.PORT}`);
});

if(process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build"));
}
>>>>>>> fcc41bef59ca3d70f94c4f9913fd37b46076b568:server.js

app.listen(port, () => {
    console.log(`Listening to port at ${port}`);
});
