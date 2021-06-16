const winston = require('winston');
const express = require('express');
const morgan = require('morgan');

const app = express();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/databaseInit')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//if NODE_ENV is not defined, app.get returns dev env by default.
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));


module.exports = server;