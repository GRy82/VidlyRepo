//will add a try-catch error-handler at runtime to a route handler as it is used.
//allows for less convolution in route handler code by not needing to have to 
//wrap manually with a middleware function.
require('express-async-errors');
//this exports a default logger. larger apps may require a custom logger.
//has transport(storage device for logs): console, file, http transports. other plugins for logging(mongo, redis, couchdb etc.)
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const Joi = require('joi');
//imports a method that can be used by Joi class.  
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const helmet = require('helmet');


const app = express();
require('./startup/routes')(app);
require('./startup/databaseInit')();

//listens for uncaught exception on the level of node, ie. something not 
//caught at a lower level. Remember that process is global object. 
//only works with synchronous code.
// process.on('uncaughtException', (ex) => {
//     winston.error(ex.message, ex);
//     process.exit(1);
// });

winston.handleExceptions( //making new transport separate from that of default logger.
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
//without this, async exception/promise rejection will not be logged.
//because uncaughtException only works for synchronous processes.
process.on('unhandledRejection', (ex) => {
    //this will work with the uncommented code above. Winston will automatically catch it.
    throw ex;
    // winston.error(ex.message, ex);
    // process.exit(1);
});

winston.add(winston.transports.File, { filename: 'logfile.log' });
winston.add(winston.transports.MongoDB, {
    db: 'mongodb://localhost/vidly',
    level: 'info' //info, and higher priority, ie. info, warning, error.
});

const p = Promise.reject(new Error('Failed miserably!'));
p.then(() => console.log('Done'));

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());


//if NODE_ENV is not defined, app.get returns dev env by default.
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));