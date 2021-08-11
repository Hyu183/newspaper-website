const express = require('express');
const router = express.Router();
const {addUser, checkNotAuthenticated} = require('../models/user.model');
const bcrypt = require('bcryptjs');
const initializePassport = require('../public/js/config/passport.config');
const passport = require('passport');

initializePassport(passport);


router.get('/sign_in', checkNotAuthenticated, function(req, res) {
    res.render('vwCategories/sign_in');
});

router.get('/register', function(req, res) {
    res.render('vwCategories/register');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureMessage: '/login',
    failureFlash: true
}))

router.post('/register', async (req, res) => {
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(req.body.password, 10);
    } catch{
        res.redirect('/register');
    }   

    const user = {
        name: req.body.name,
        email: req.body.email,
        user_name: req.body.username,
        password: hashedPassword,
        birthday: '2000-01-01',
        user_type: 0
    }

    console.log(req.body);
    addUser(user).then(
        () => {
            console.log("success");
            res.redirect('/');
        }
    ).catch( (err) =>
        {
            console.log(err);
            return;
        }        
    );
});


module.exports = router;