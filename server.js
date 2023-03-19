/*************************************************************************************
* WEB322 - 2231 Project
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Jasprit Kaur
* Student ID    : 142774215
* Course/Section: WEB322 ZBB
* cyclic link   :https://alive-blue-pangolin.cyclic.app/
**************************************************************************************/
import express from 'express';
import { engine } from 'express-handlebars';
import * as dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import generalController from './Controller/general.js';
import rentalsController from './Controller/rentals.js';
dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const app = express();
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.static('images'))
app.use(express.static('css'))
app.use(express.static('js'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.get('/', generalController.home);
app.get('/welcome', generalController.welcome);
app.get('/sign-up', generalController.signUp);
app.post('/sign-up', generalController.signUpPost);
app.get('/log-in', generalController.logIn);
app.post('/log-in', generalController.logInPost);
app.get('/rentals', rentalsController.rentals);
app.use(generalController.notFound);
const HTTP_PORT = process.env.PORT || 8080;
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}
app.listen(HTTP_PORT, onHttpStart);

