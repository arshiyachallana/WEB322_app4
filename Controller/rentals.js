import { getRentalsByCityAndProvince, getFeaturedRentals } from "../Data Module/rentals-db.js";
const rentalsController = {
    rentals: (req, res) => {
        res.render('rentals', {
            rentalsByCity: getRentalsByCityAndProvince(),
            authenticated: req.session.authenticated,
            isCustomer: req.session.role === "Customer"
        });
    },
};

export default rentalsController;