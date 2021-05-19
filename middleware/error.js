const winston = require('winston');

//only catches errors within the context of express routes.  
module.exports = function(err, req, res, next){
    //levels of logging priority: error, warn, info, verbose, debug, silly
    winston.error(err.message, err);
    //or: winston.log('error', err.message);

    res.status(500).send('Something failed.');
}