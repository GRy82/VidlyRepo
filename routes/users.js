const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User, validate } = require('../models/user');

//registers a user. 
router.post('/', (req, res) => {
    const result = validate(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    //Checks that the email is not yet registered with a user.
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    user.save();
    res.send(user);
});

module.exports = router;

//Authentication: To verify that an individual is who they say they are.
//Authorization: Granting privileges and permissions based on user status.