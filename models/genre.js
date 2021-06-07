const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = mongoose.Schema({
    genreTitle: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre){
    const schema = Joi.object({
        genreTitle: Joi.string().min(5).max(50).required()
    });

    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;