const mongoose = require('mongoose');
const Joi = require('joi');
const {movieSchema} = require('./movie');
const {customerSchema} = require('./customer');


const rentalSchema = mongoose.Schema({
    movie: {
        type: movieSchema,
        required: true
    },
    customer: {
        type: customerSchema,
        required: true
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = Joi.object({
        movieId: Joi.string().required(),
        customerId: Joi.string().required()
    });

    return schema.validate(rental);
}

exports.Rental = Rental;
exports.rentalSchema = rentalSchema;
exports.validate = validateRental;