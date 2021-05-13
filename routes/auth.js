const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');

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

    //JSON Web Token: long string that identifies a user.
    //Client can save the web token and use it for future api requests. WIll be stored in local browser(cache?)
    //JWT.io is a place where you can debug when working with JSON WebTokens.
    //Web Token has three properties. Header(alg, typ), Payload(public properties), Digital Signature(private key only available on the server.)
    //iat property in a decoded web token can be used as a time stamp for the token.
    const token = jwt.sign({ _id = user._id }, config.get('jwtPrivateKey'));//second is private key/secret. DOn't ever store in source code. It's ok for now.
    
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