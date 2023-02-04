const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get("/login/success", (req, res) => {
    if(req.user){
        const token = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
        res.status(200).json({
            user: req.user,
            aToken: token,
        })
    }
    else{
        res.status(403).json({error: true, message: "Not authorized"})
    }
})

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    })
})

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "http://localhost:3000",
        failureRedirect: "/login/failed",
    })
);

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}))

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("http://localhost:3000");
})

module.exports = router;


