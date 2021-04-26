const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');

router.get('/', async (req, res) => {
    const movies = await Movie.find()
    .sort({ title: 1 })
    .select('name');

    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    
    if(!movie) return res.status(404).send('Could not find a movie with the id provided.');

    res.send(movie);
});

router.post('/', async (req, res) => {
    const result = validate(req.body);

    if(result.error) return res.status(400).send(result.error.details[0].message);

    let movie = new Movie({
        title: req.body.title,
        genre: {
            name: req.body.genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentals: req.body.dailyRentals
    });

    movie = await movie.save();

    res.send(movie);
});

router.put('/:id', async (req, res) => {
    const result = validate(req.body);

    if(result.error) return res.status(400).send(result.error.details[0].message);
  
    const movie = await Movie.findByIdAndUpdate(req.params.id,
        {   
            title: req.body.title,
            genre: {
                name: req.body.genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentals: req.body.dailyRentals,
        }
    , { new: true });

    if(!movie) return res.status(404).send('Could not find a movie with the id provided.')

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if(!movie) return res.status(400).send('Could not find a movie with the id provided.');

    res.send(movie);
});

module.exports = router;