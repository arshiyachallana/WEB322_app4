const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    user_Fname: String,
    user_Lname: String,
    user_email: String,
    password: String,
});
mongoose.connect('mongodb+srv://Jkaur5370:Jasprit%401@web322jas-2231.lqfqtpc.mongodb.net/test');
const userModel = mongoose.model('users', userSchema);

module.exports = userModel;