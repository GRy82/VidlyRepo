const express = require('express');
const app = express();
const logger = require('./logger');
const authenticator = require('./authenticator');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const genres = require('./routes/genres');
const home = require('./routes/home');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('api/genres', genres);
app.use('/', home);

//if NODE_ENV is not defined, app.get returns dev env by default.
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log('Mogran enabled...');
}
app.use(logger);
app.use(authenticator);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));