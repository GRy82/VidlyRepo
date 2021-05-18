//By coding the error handling like this, where the handler is returned to the
//route function, you don't need to repeat try-catch blocks for every single route
//handler. You pass the handler logic to this middleware function so that you have 
//access to req and res and next parameters. Then the function logic is passed back
//to the handler but within a try-catch block.  


module.exports = function asyncMiddleware(handler){
    return async (req, res, next) => {
        try{
            await handler(req, res);
        }
        catch(ex){
            next(ex);
        }
    };
}