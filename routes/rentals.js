const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');

    if(!rentals) return res.status(404).send('A rental could not be found with the id provided.');

    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    res.send(rental);
});

router.post('/', async (req, res) => {
    const result = validate(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(404).send('A movie could not be found with the id provided.');

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(404).send('A customer could not be found with the id provided.');

    if(movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    // rental = await rental.save();
    // movie.numberInStock--;
    // movie.save();

    // res.send(rental);

    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

        res.send(rental);
    }
    catch{
        res.status(500).send('Something failed.');
    }

});

module.exports = router;