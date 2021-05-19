//will add a try-catch error-handler at runtime to a route handler as it is used.
//allows for less convolution in route handler code by not needing to have to 
//wrap manually with a middleware function.
require('express-async-errors');
//this exports a default logger. larger apps may require a custom logger.
//has transport(storage device for logs): console, file, http transports. other plugins for logging(mongo, redis, couchdb etc.)
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const error = require('./middleware/error');
const Joi = require('joi');
//imports a method that can be used by Joi class.  
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const home = require('./routes/home');
const mongoose = require('mongoose');

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

//see rentals.js for "under the hood" info on mongoose and mongoDB.
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to db...'))
    .catch((err) => console.error('Couldn\'t connect to db: ', err));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home);
//error middleware
//must be registered after all other middleware functions
//this line is required for express-async-errors to work.
app.use(error);

//if NODE_ENV is not defined, app.get returns dev env by default.
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));