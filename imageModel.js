import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    stegoImageURL: {type: String}
}, {
    timestamps: true
});

const StegoImages = mongoose.model("stegoimages",imageSchema);

export default StegoImages;