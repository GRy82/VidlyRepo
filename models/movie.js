const mongoose = require('mongoose');
const Joi = require('joi');


const genreSchema = mongoose.Schema({
    name: String
});

const Movie = mongoose.model('Movie', mongoose.Schema({
    title: String,
    genre: genreSchema,
    numberInStock: Number,
    dailyRentalRate: Number
}));

function validateMovie(movie){
    const Schema = Joi.object({
        title: Joi.string().min(2).max(50).required(),
        numberInStock: Joi.Number().min(0).max(1000).required(),
        dailyRentalRate: Joi.Number().min(0).max(50).required()
    });
}

exports.Movie = Movie;
exports.validate = validateMovie;