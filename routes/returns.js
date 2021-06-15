const moment = require('moment');
const express = require('express');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const router = express.Router();
const auth = require('../middleware/auth');


router.post('/', auth, async (req, res) => {
    if(!req.body.customerId) 
        return res.status(400).send('customerId not provided');
    if(!req.body.movieId) 
        return res.status(400).send('movieId not provided');

    const rental = await Rental.findOne({ 'movie._id': req.body.movieId, 
                                    'customer._id': req.body.customerId });

    if(!rental) 
        return res.status(404).send('rental not found');

    if(rental.dateReturned)
        return res.status(400).send('That movie was already returned.');

    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.updateOne({ _id: rental.movie._id }, 
        { $inc: { numberInStock: 1 } });

    return res.status(200).send(rental);
});

module.exports = router;