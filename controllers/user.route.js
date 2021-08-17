const express = require('express');
const router = express.Router();
const {addUser, checkNotAuthenticated, checkAuthenticated, updateSubdate} = require('../models/user.model');
const bcrypt = require('bcryptjs');
const initializePassport = require('../public/js/config/passport.config');
const passport = require('passport');
const moment = require('moment');
const userModel = require('../models/user.model');
const sendMail = require('../public/js/sendEmail.js');

initializePassport(passport);

const generateOTP = () => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

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


router.get('/otp/:username', function(req, res) {
    const username = req.params.username;
    console.log(req.params.username);
    res.render('vwUser/otp', {username: username});
});

router.get('/otppassword', function(req, res) {
    req.user.then((user) => {
        const username = user.user_name;
        console.log('usermail', user);
        sendMail(user.email, user.name, 'News Changing Password OTP Email', 
            "You have requested a password change at News", user.otp);
        res.render('vwUser/otpPassword', {username: username});
    })
});

router.get('/editArticle/:id', function(req, res) {
    const id = req.params.id;
    console.log(req.params.username);
    res.render('vwUser/otp', {username: username});
});

router.post('/resentotp', async function(req, res) {
    const username = req.body.username;
    console.log(username);
    const user = await userModel.findByUsername(username);
    sendMail(user.email, user.name, 'News Registing Conformation Email', 
                "This is your conformation email for registing at News", user.otp);
    res.render('vwUser/otp', {username: username, message: "We have resended the OTP to your email."});
});

router.get('/subscribe', checkAuthenticated, function(req, res) {
    res.render('vwUser/subscription.hbs');
});

router.post('/otpConfirm', async (req, res) => {
    const currOTP = req.body.otp;
    const username = req.body.username;
    const user = await userModel.findByUsername(username);
    if (currOTP === user.otp){
        userModel.activateUser(user.id).then(() => res.render('vwUser/waiting', {message: "Your account is activated!"}));
    } else {
        res.render('vwUser/otp', {message: "Wrong OTP code!", username: username});
    };
});

router.post('/otpConfirmPassword', async (req, res) => {
    const currOTP = req.body.otp;
    const username = req.body.username;
    const password = req.body.password;
    const passwordRepeat = req.body.password_repeat;
    console.log(password, passwordRepeat);
    const user = await userModel.findByUsername(username);
    if (currOTP === user.otp){
        if (password === passwordRepeat){
            const hashedPassword = await bcrypt.hash(password, 10);
            userModel.updatePassword(user.id, hashedPassword).then(() => res.render('vwUser/waiting', {message: "Your password has been changed!"}));
        }
        else {
            res.render('vwUser/otpPassword', {message: "Password repeat need to be the same as Password.", username: username});
        }
    } else {
        res.render('vwUser/otpPassword', {message: "Wrong OTP code!", username: username});
    };
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

router.post('/changeInfo', (req, res) => {
    req.user.then((user) => {
        let newUser = user;
        newUser['name'] = req.body.name;
        newUser['email'] = req.body.email;
        newUser['birthday'] = req.body.birthdate.split("/").reverse().join("-");
        console.log(newUser);
        userModel.patch(newUser).then(() => {
            res.render('vwUser/waiting', {message: "Your info has been changed!"});
        });
    });
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
    failureRedirect: '/user/sign_in',
    failureFlash: true
}))

router.post('/register', async (req, res) => {
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(req.body.password, 10);
    } catch{
        res.redirect('/register');
    }   

    const generatedOTP = generateOTP();
    const user = {
        name: req.body.name,
        email: req.body.email,
        user_name: req.body.username,
        password: hashedPassword,
        birthday: req.body.birthdate.split("/").reverse().join("-"),
        user_type: 0,
        otp: generatedOTP,
    }

    addUser(user).then(
        () => {
            console.log("success");
            sendMail(user.email, user.name, 'News Registing Conformation Email', 
                "This is your conformation email for registing at News", user.otp);
            res.render('vwUser/otp', {username: user.user_name});
            }
    ).catch( (err) =>
        {
            console.log(err);
            return;
        }        
    );
});


module.exports = router;