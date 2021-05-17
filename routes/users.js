const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');

//registers a user. 
router.post('/', async (req, res) => {
    const result = validate(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    //Checks that the email is not yet registered with a user.
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered');

    //using lodash to avoid repetition of 'req.body.property' on every line.
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    //salt randomly generated then added to hashed password to encrypt it.
    const salt = await bcrypt.genSalt(10); 
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    //header is another part of the response. First param: is a key, second param is value.
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    //An object representing the user, but without password property ^^^^^
});

module.exports = router;

//Authentication: To verify that an individual is who they say they are.
//Authorization: Granting privileges and permissions based on user status.

//consider using joi-password-complexity npm module in the future.