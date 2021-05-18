module.exports = function (req, res, next){
    //will be executed following auth.js middleware function.
    if(!req.user.isAdmin) return res.status(403).send('Access denied.');

    next();
}

//401: UNAUTHORIZED: user trying to access protected resource without valid JWT
//403: FORBIDDEN: Valid web token sent, but you're still not allowed.