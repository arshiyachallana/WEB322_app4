import mongoose from 'mongoose';
mongoose.connect('mongodb+srv://Jkaur5370:Jasprit%401@web322jas-2231.lqfqtpc.mongodb.net/web322Jas-2231');
const userSchema = new mongoose.Schema({
    user_Fname: String,
    user_Lname: String,
    user_email: String,
    password: String,
});
const userMode = mongoose.model('User', userSchema)
export default userMode;