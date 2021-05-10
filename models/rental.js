const mongoose = require('mongoose');
const Joi = require('joi');
const {movieSchema} = require('./movie');
const {customerSchema} = require('./customer');

//Mongoose, not MongoDB, is what creates unique _id's for each document/db object.
const rentalSchema = mongoose.Schema({
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 50
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        })
    },
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
        })
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = Joi.object({
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required()
    });

    return schema.validate(rental);
}

exports.Rental = Rental;
exports.rentalSchema = rentalSchema;
exports.validate = validateRental;