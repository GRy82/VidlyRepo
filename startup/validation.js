const Joi = require('joi');

module.exports = function() {
    //imports a method that can be used by Joi class.  
    Joi.objectId = require('joi-objectid')(Joi);
}