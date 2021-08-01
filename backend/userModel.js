import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isVerified: {type: Boolean, default: false},
        numberOfEncodes : {type: Number, default: 0},
        numberOfDecodes : {type: Number, default: 0},
        verifyEmailToken: {type: String},
        verifyEmailTokenExpires: {type: Date},
        passwordResetToken: {type: String},
        passwordResetTokenExpires: {type: Date},
    },
    //This second parameter is default. this is automatically created
    {
        //This creates 2 property:value pairs, 
        //1)The time at which obj is created and 2) The time at which it is last updated
        timestamps: true,
    }
);

const Users = mongoose.model("users", userSchema);

export default Users;