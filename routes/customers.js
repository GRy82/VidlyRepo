const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('Joi');

const Customer = mongoose.model('Customer', mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255,
    },
    phone: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 17
    }
}));

router.get('/', async (req, res) => {
    const customers = await Customer.find()
    .sort({ name: 1 })
    .select('name isGold');

    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    
    if(!customer) return res.status(404).send('Could not find a customer with the id provided.');

    res.send(customer);
});