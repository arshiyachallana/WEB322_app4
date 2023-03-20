import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config()
mongoose.connect(process.env.mongodbURL);
const userSchema = new mongoose.Schema({
    user_Fname: String,
    user_Lname: String,
    user_email: String,
    password: String,
});
const userMode = mongoose.model('User', userSchema)
export default userMode;