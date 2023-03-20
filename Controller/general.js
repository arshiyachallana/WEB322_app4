import { getFeaturedRentals } from "../Data Module/rentals-db.js";
import bcrypt from "bcryptjs";
import userMode from "../models/userModel.js";
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const generalController = {
    home: (req, res) => {
        res.render('home', {
            featuredRentals: getFeaturedRentals(),
            authenticated: req.session.authenticated,
            isCustomer: req.session.role === "Customer"
        });
    },

    welcome: (req, res) => {
        if (req.session.authenticated) {
            res.render('welcome', {
                authenticated: req.session.authenticated,
                isCustomer: req.session.role === "Customer"
            });
        } else {
            res.redirect("/");
        }
    },
    signUp: (req, res) => {
        if (req.session.authenticated) {
            res.redirect("/");
        } else {
            res.render('sign-up', {
                authenticated: req.session.authenticated,
                isCustomer: req.session.role === "Customer"
            }); 
        }

    },
    signUpPost: async (req, res) => {
        const fName = req?.body?.fName;
        const lName = req?.body?.lName;
        const email = req?.body?.email;
        const password = req?.body?.password;
        var emailError = ""
        var passwordError = ""
        var fNameError = ""
        var lNameError = ""
        if (!fName) {
            fNameError = 'First name is required';
        }
        if (!lName) {
            lNameError = 'Last name is required';
        }
        if (!email) {
            emailError = 'Email is required';
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            emailError = 'Invalid email format';
        }
        if (!password) {
            passwordError = 'Password is required';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,12}$/.test(password)) {
            passwordError = 'Password must be between 8 to 12 characters and contain at least one lowercase letter, uppercase letter, number, and symbol';
        }
        if (emailError == "" && passwordError == "" && fNameError == "" && lNameError == "") {
            const userRes = await userMode.findOne({ user_email: email })
            if (userRes?.user_email) {
                res.send({
                    status: 400,
                    fName: fNameError,
                    lName: lNameError,
                    email: "Email exists",
                    password: passwordError,
                });
            } else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        let user = new userMode({
                            user_Fname: fName,
                            user_Lname: lName,
                            user_email: email,
                            password: hash,
                        });
                        try {
                            const store = await user.save();
                            const msg = {
                                to: email,
                                from: 'Jaspritk246701@gmail.com',
                                subject: `Welcome to Renttastic, ${fName}`,
                                text: `Dear ${fName + " " + lName},\n\nI am delighted to welcome you to Renttastic. Thank you for joining our us!!\n\nIf you have any questions or feedback, please do not hesitate to reach out to me or our support team.\n\nBest regards,\nJasprit Kaur,\nRenttastic`,
                            };
                            sgMail
                                .send(msg)
                                .then(() => {
                                    console.log("sgMail then");
                                }, error => {
                                    console.error("sgMail err", error);

                                    if (error.response) {
                                        console.error(error.response.body)
                                    }
                                });
                            res.send({
                                status: 200,
                                message: "success !!"
                            });
                        } catch (error) {
                            return console.error(error)
                        }
                    });
                });
            }
        } else {
            res.send({
                status: 400,
                fName: fNameError,
                lName: lNameError,
                email: emailError,
                password: passwordError,
            });
        }
    },
    logOut: async (req, res) => {
        try {
            req.session.destroy(function (err) { return console.error(err); });
            res.locals.authenticated = undefined;
            res.locals.role = undefined;
            res.redirect("/");
        } catch (error) {
            console.log("logOut:", error);
        }
    },
    logIn: (req, res) => {
        if (req.session.authenticated) {
            res.redirect("/");
        } else
        res.render('log-in', {
            authenticated: req.session.authenticated,
            isCustomer: req.session.role === "Customer"
        });
    },
    logInPost: async (req, res) => {
        const email = req?.body?.email;
        const password = req?.body?.password;
        const role = req?.body?.role;
        var emailError = ""
        var passwordError = ""
        if (!email) {
            emailError = 'Email is required';
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            emailError = 'Invalid email format';
        }
        if (!password) {
            passwordError = 'Password is required';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,12}$/.test(password)) {
            passwordError = 'Password must be between 8 to 12 characters and contain at least one lowercase letter, uppercase letter, number, and symbol';
        }
        if (emailError == "" && passwordError == "") {
            const user = await userMode.findOne({ user_email: email })
            if (user) {
                bcrypt.compare(password, user?.password, function (err, bcrypt) {
                    if (bcrypt) {
                        req.session.authenticated = user;
                        req.session.role = role;
                        res.send({
                            status: 200,
                            message: "success !!"
                        });
                    } else {
                        res.send({
                            status: 400,
                            message: "error !!",
                            email: emailError,
                            password: "Invalid Password",
                        });
                    }
                });
            } else {
                res.send({
                    status: 400,
                    message: "error !!",
                    email: "Invalid email !",
                    password: passwordError,
                });
            }
        } else {
            res.send({
                status: 400,
                message: "error !!",
                email: emailError,
                password: passwordError,
            });
        }
    },
    cart: (req, res) => {
        if (req.session.role !== "Customer") {
            res.render('rentals', {
                rentalsByCity: getRentalsByCityAndProvince(),
                authenticated: req.session.authenticated,
                isCustomer: req.session.role === "Customer"
            });
        } else {
            res.send({
                status: 401,
                message: "access is denied"
            });
        }

    },
    notFound: (req, res) => {
        res.status(404).send("Page Not Found");
    }
};

export default generalController;