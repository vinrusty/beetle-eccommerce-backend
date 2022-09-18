const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    var token = req.body['x-access-token'] || req.query['x-access-token'] || req.headers['x-access-token'];
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){
                res.status(403).json('unauthorized');
            }
            else{
                req.user = user;
                next();
            }
        })
    }
    else {
        res.status(403).json('no-token');
    }
}