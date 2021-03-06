const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genre');
const validateObjectId = require('../middleware/validateObjectId');


router.get('/', async (req, res) => {
    //throw new Error('Could not get the genres.');
    const genres = await Genre.find().sort('title');
    res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if(!genre) 
        return res.status(404).send('A genre with that id does not exist.');

    res.send(genre);
});


router.post('/', auth, async (req, res) => {
    const result = validate(req.body);
    if(result.error)
       return res.status(400).send(result.error.details[0].message);

    let genre = new Genre({ title: req.body.title });
    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', [auth, validateObjectId] , async (req, res) => {
    const result = validate(req.body);
    if(result.error) 
        return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id,
         {title: req.body.title }, 
         { new: true });

    if(!genre) 
        return res.status(404).send('A genre with that id does not exist.');

    res.send(genre);
});

//middleware functions passed as array. if auth is verified, and admin is verified
//then the route handler will be executed. Otherwise, it does not execute.
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre) 
        return res.status(404).send('A genre with that id does not exist.');

    res.send(genre);
});


module.exports = router;