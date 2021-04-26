const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', mongoose.Schema({
    genreTitle: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    }
}));

function validateGenre(genre){
    const schema = Joi.object({
        genreTitle: Joi.string().min(3).required()
    });

    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = Genre.genreSchema;