const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const Customer = mongoose.model('Customer', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255,
    },
    isGold: {
        type: Boolean,
        required: true
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

router.post('/', async (req, res) => {
    const result = validateCustomer(req.body);

    if(result.error) return res.status(400).send(result.error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });

    customer = await customer.save();

    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const result = validateCustomer(req.body);

    if(result.error) return res.status(400).send(result.error.details[0].message);
  
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: {  name: req.body.name,
                isGold: req.body.isGold,
                phone: req.body.phone,
        }
    }, { new: true });

    if(!customer) return res.status(404).send('Could not find a customer with the id provided.')

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if(!customer) return res.status(400).send('Could not find a customer with the id provided.');

    res.send(customer);
});

function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().min(7).max(17).required()
    });

    return schema.validate(customer);
}

module.exports = router;