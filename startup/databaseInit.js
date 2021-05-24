//see rentals.js for "under the hood" info on mongoose and mongoDB.
const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function(){
    const db = config.get('db');
    mongoose.connect(db)
        .then(() => winston.info(`Connected to ${db}...`));
        //global error handler will catch exception. No need for .catch.
}