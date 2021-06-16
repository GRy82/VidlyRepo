const compression = require('compression');
const helmet = require('helmet');
// compression compresses the HTTP responses sent to users.


//This function will be used to install the above middleware pieces.
module.exports = function(app){
    app.use(compression());
    app.use(helmet());
}
