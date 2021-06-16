const helmet = require('helmet');
const compression = require('compression');
// compression compresses the HTTP responses sent to users.


//This function will be used to install the above middleware pieces.
module.exports = function(app){
    app.use(helmet());
    app.use(compression());
}
