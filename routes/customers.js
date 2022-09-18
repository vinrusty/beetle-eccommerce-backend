const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Customer = require('../models/Customer');
const RefreshToken = require('../models/RefreshToken');
const authenticate = require('../middlewares/authenticate')

function generateAccessToken(user){
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    return token;
}

function generateRefreshToken(user){
    const token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    return token;
}

router.post('/register', (req, res) => {
    const {firstName, lastName, email, phone, address, password, city, state} = req.body;
    const hasedPassword = bcrypt.hashSync(password, 10);
    try{
        Customer.findOne({email: email}, (err, result) => {
            if(err){
                res.status(500).json('server error')
            }
            else if(!result){
                const customer = new Customer({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    password: hasedPassword,
                    address: address,
                    city: city,
                    state: state
                })
                const savedCustomer = customer.save();
                res.json(savedCustomer);
            }
            else{
                res.status(403).json('customer already exists');
            }
        })
        
    }
    catch(err){
        res.status(500).json('error in registering');
    }
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    Customer.findOne({email: email}, (err, result) => {
        if(err){
            res.status(500).json('server error');
        }
        else if(!result){
            res.status(403).json('unauthorized');
        }
        else{
            if(bcrypt.compareSync(password, result.password)){
                const aToken = generateAccessToken({email: result.email});
                const rToken = generateRefreshToken({email: result.email});
                const token = new RefreshToken({
                    refreshToken: rToken
                });
                token.save();
                res.json({
                    user: result.email,
                    aToken: aToken,
                    rToken: rToken
                })
            }
            else{
                res.status(403).json('unauthorized')
            }
        }
    })
})

router.delete('/logout', authenticate, (req, res) => {
    const token = req.body['x-access-token'] || req.headers['x-access-token'];
    try{
        RefreshToken.deleteOne({refreshToken: token})
        res.json('success')
    }
    catch(err){
        res.status(500).json('error')
    }
})

router.post('/refresh', (req, res) => {
    const refreshToken = req.body.token

    if(!refreshToken) return res.status(401).json("You are not authenticated")
    RefreshToken.findOne({refreshToken: refreshToken}, (err, result) => {
        if(err) return res.status(403).json("You are not authenticated")
        else if(!result){
            return res.status(403).json("Refresh token is not valid")
        }
        else{
            jwt.verify(result.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.sendStatus(403)
                RefreshToken.deleteOne({refreshToken: result})
                const newAccessToken = generateAccessToken({name: user.email})
                const newRefreshToken = jwt.sign({name: user.email}, process.env.REFRESH_TOKEN_SECRET)

                const rToken = new RefreshToken({ refreshToken: newRefreshToken })
                rToken.save()
                res.status(200).json({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                })
            })
        }
    })
})

module.exports = router;

