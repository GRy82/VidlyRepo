const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const {Genre} = require('../models/genre');

router.get('/', async (req, res) => {
    const movies = await Movie.find()
    .sort({ title: 1 });

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

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Could not find a genre with the id provided.');

    const movie = new Movie({
        title: req.body.title,
        genre: {
           _id: genre._id,
           genreTitle: genre.genreTitle
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();

    res.send(movie);
});

router.put('/:id', async (req, res) => {
    const result = validate(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);
  
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Could not find a genre with the id provided.');

    const movie = await Movie.findByIdAndUpdate(req.params.id,
        {   
            title: req.body.title,
            genre: {
                _id: genre._id,
                genreTitle: genre.genreTitle
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        }
    , { new: true });

    if(!movie) return res.status(404).send('Could not find a movie with the id provided.')

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if(!movie) return res.status(404).send('Could not find a movie with the id provided.');

    res.send(movie);
});

module.exports = router;