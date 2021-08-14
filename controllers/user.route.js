const express = require('express');
const router = express.Router();
const {addUser, checkNotAuthenticated, checkAuthenticated, updateSubdate} = require('../models/user.model');
const bcrypt = require('bcryptjs');
const initializePassport = require('../public/js/config/passport.config');
const passport = require('passport');
const moment = require('moment');

initializePassport(passport);


router.get('/userInfo', checkAuthenticated,function(req, res) {
    req.user.then((user) =>
    {
        console.log(user);
        res.render('vwCategories/userInfo', {
            user_name: user.user_name,
            name: user.name,
            email: user.email,
            birthdate: moment(user.birthday).format('DD-MM-YYYY')
        });
    })
});


router.get('/sign_in', checkNotAuthenticated, function(req, res) {
    res.render('vwCategories/sign_in');
});


router.get('/subscribe', checkAuthenticated, function(req, res) {
    res.render('vwUser/subscription.hbs');
});

router.post('/subscribe', function(req, res) {
    req.user.then((user) => {
        const currSub = user.subcription_due_date;
        const nDaybuy = req.body.no_day_buy;
        let newSubdate;
        if (user.subcription_due_date){
            newSubdate = moment(currSub);
            console.log("currday", newSubdate);
        }
        else{
            newSubdate = moment();
            console.log("curr date null", newSubdate);
        }
        newSubdate = newSubdate.add(nDaybuy, 'days');
        const mysqlnewdate = newSubdate.toDate().toISOString().slice(0, 19).replace('T', ' ');
        console.log(user.id, req.body.no_day_buy, mysqlnewdate);
        updateSubdate(user.id, mysqlnewdate).then(() => {
            const msg = "Thank you for buying premium, your subscription lasts until " + mysqlnewdate; 
            res.render('vwUser/waiting', {message: msg});
        });
    });
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
        birthday: req.body.birthdate.split("/").reverse().join("-"),
        user_type: 0
    }

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