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
import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);
dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const app = express();
app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: {
    navLink: function (url, options) {
      return '<li' +
        ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item"') +
        '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
    },
  }
}));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.static('images'))
app.use(express.static('css'))
app.use(express.static('js'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
var store = new MongoDBStore({
  uri: process.env.mongodbURL,
  collection: 'users'
});
store.on('error', function (error) {
  console.log("store error---", error);
})
app.use(session({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  },
  store: store,
  resave: false,
  saveUninitialized: true
}));
app.use((req, res, next) => {
  res.locals.authenticated = req.session.authenticated;
  next();
});
app.get('/', generalController.home);
app.get('/welcome', generalController.welcome);
app.get('/sign-up', generalController.signUp);
app.post('/sign-up', generalController.signUpPost);
app.get('/log-in', generalController.logIn);
app.post('/log-in', generalController.logInPost);
app.get('/log-out', generalController.logOut);
app.get('/rentals', rentalsController.rentals);
app.use(generalController.notFound);
const HTTP_PORT = process.env.PORT || 8080;
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}
app.listen(HTTP_PORT, onHttpStart);

