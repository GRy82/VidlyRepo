//Notes about security at the bottom of file.

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const {User} = require('../models/user');

//Log in as a user. 
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

//Do not store tokens on a server. It allows a malicious hacker to be able to access
//all tokens in one place. Equivalent to having a centralized place where someone
//has access to an entire database of driver's licenses or passports.  With tokens,
//malicious user can make 'authorized' changes. 

//Tokens should be stored on client. If needed to be sent to server, use https.
//Https provides that what is sent from client to server is encrypted while in traffic.
//If you were needing to store tokens on a server, make sure tokens are hashed, or 
//have additional security measures in place.  