const express = require('express');
const router = express.Router();
const {Rental, validate} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');

    res.send(rentals);
});

router.post('/', async (req, res) => {
    const result = validate(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(404).send('A movie could not be found with the id provided.');

    const customer = await Customer.findById(req.body.movieId);
    if(!customer) return res.status(404).send('A customer could not be found with the id provided.');

    if(movie.numberInSock === 0) return res.status(400).send('Movie not in stock');

    let rental = produceRental(movie, customer, req.body);
    rental = await rental.save();

    movie.numberInSock--;
    movie.save();
    
    res.send(rental);
});

async function produceRental(movie, customer, rental){
    return new Rental({
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        }
    });

}
