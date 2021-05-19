
const express = require('express');
const helmet = require('helmet');

const app = express();
require('./startup/logging');
require('./startup/routes')(app);
require('./startup/databaseInit')();
require('./startup/config')();

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