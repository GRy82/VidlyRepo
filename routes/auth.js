const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const {User} = require('../models/user');

//registers a user. 
router.post('/', async (req, res) => {
    const result = validate(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    //Checks that the email is registered.
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or password');

    //bcrypt will run entered pw through hash func, and add salt, then compare.
    const validPassword = bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    
    res.send(token);
});

function validate(req){
    const schema = Joi.object({
        email: Join.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(user);
}

module.exports = router;