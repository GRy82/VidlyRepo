//see rentals.js for "under the hood" info on mongoose and mongoDB.
const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function(){
    mongoose.connect('mongodb://localhost/vidly')
        .then(() => winston.info('Connected to db...'));
        //global error handler will catch exception. No need for .catch.
}