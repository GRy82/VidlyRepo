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
    user = new User(_.pick(user, ['name', 'email', 'password']));
    //salt randomly generated then added to hashed password to encrypt it.
    const salt = await bcrypt.genSalt(10); 
    user.password = bcrypt.hash(user.password, salt);

    await user.save();
    //stores new object representing the user that doesn't include pw prop.
    user = _.pick(user, ['name', 'email']);

    res.send(user);
});

module.exports = router;

//Authentication: To verify that an individual is who they say they are.
//Authorization: Granting privileges and permissions based on user status.

//consider using joi-password-complexity npm module in the future.