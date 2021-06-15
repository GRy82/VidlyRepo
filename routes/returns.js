const express = require('express');
const { Rental } = require('../models/rental');
const router = express.Router();


router.post('/', async (req, res) => {
    if(!req.body.customerId) 
        return res.status(400).send('customerId not provided');
    if(!req.body.movieId) 
        return res.status(400).send('movieId not provided');

    const rental = await Rental.findOne({ 'movie._id': req.body.movieId, 
                                    'customer._id': req.body.customerId });

    if(!rental) 
        return res.status(404).send('rental not found');

    res.status(401).send('user not logged in');
});

module.exports = router;