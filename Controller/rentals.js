import { getRentalsByCityAndProvince, getFeaturedRentals } from "../Data Module/rentals-db.js";
const rentalsController = {
    rentals: (req, res) => {
        res.render('rentals', {
            rentalsByCity: getRentalsByCityAndProvince()
        });
    },

};

export default rentalsController;