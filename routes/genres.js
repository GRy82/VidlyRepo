const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genre');

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('genreTitle');
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if(!genre) 
        return res.status(404).send('A genre with that id does not exist.');

    res.send(genre);
});


router.post('/', async (req, res) => {
    const result = validate(req.body);
    if(result.error)
       return res.status(400).send(result.error.details[0].message);

    let genre = new Genre({ genreTitle: req.body.genreTitle });
    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const result = validate(req.body);
    if(result.error) 
        return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id,
         {genreTitle: req.body.genreTitle }, 
         { new: true });

    if(!genre) 
        return res.status(404).send('A genre with that id does not exist.');

    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre) 
        return res.status(404).send('A genre with that id does not exist.');

    res.send(genre);
});


module.exports = router;