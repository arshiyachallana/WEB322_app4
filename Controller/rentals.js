import { getRentalsByCityAndProvince } from "../Data Module/rentals-db.js";
const rentalsController = {
    rentals: (req, res) => {
        res.render('rentals', {
            rentalsByCity: getRentalsByCityAndProvince(),
            authenticated: req.session.authenticated,
            isCustomer: req.session.role === "Customer"
        });
    }, 
    list: (req, res) => {
        if (req.session.role === "Data Entry Clerk") {
            res.send("Welcome, data clerk! You can now add, remove and modify rental properties.")
        } else {
            res.send({
                status: 401,
                message: "access is denied"
            });
        }

    }
};

export default rentalsController;