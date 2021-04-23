const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

const Genre = mongoose.model('Genre', mongoose.Schema({
    genreTitle: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    }
}));

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
    const result = validateGenre(req.body);
    if(result.error)
       return res.status(400).send(result.error.details[0].message);

    let genre = new Genre({ genreTitle: req.body.genreTitle });
    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const result = validateGenre(req.body);
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

function validateGenre(genre){
    const schema =  Joi.object({
        genreTitle: Joi.string().min(3).required()
    });

    return schema.validate(genre);
}

module.exports = router;