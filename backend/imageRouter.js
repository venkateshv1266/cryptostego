import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import StegoImages from './imageModel.js';
import Users from './userModel.js';

const imageRouter = express.Router();

imageRouter.post(
    "/retrieve",
    expressAsyncHandler( async (req,res) => {
        if(req.body.stegoImageID){
            try{
                const stegoImage = await StegoImages.findOne({_id : req.body.stegoImageID});
                res.send({
                    stegoImageURL: stegoImage.stegoImageURL
                })
            } catch(err) {
                res.status(404).send("Invalid Stego Image ID");
            }
        }
        return
    })
)

imageRouter.post(
    "/upload",
    expressAsyncHandler( async (req,res) => {
        const stegoImage = new StegoImages({
            stegoImageURL: req.body.stegoImageURL
        });
        try{
            const createdStegoImage = await stegoImage.save(); //Now data is saved in mongo db
            res.send({
                _id: createdStegoImage._id
            })
            return;
        } catch(err) {
            res.status(409).send("Unable to save the stego image in the database");
        }
    })
)

export default imageRouter;