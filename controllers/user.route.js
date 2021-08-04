const express = require('express');
const router = express.Router();
const {addUser} = require('../models/user.model');



router.get('/sign_in', function(req, res) {
    res.render('vwCategories/sign_in');
});

router.get('/register', function(req, res) {
    res.render('vwCategories/register');
});

router.post('/register', (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        user_name: req.body.username,
        password: req.body.password,
        birthday: '2000-01-01',
        user_type: 0
    }
    console.log(req.body);
    addUser(user).then(
        () => {
            console.log("success")
        }
    ).catch( (err) =>
        {
            console.log(err);
        }        
    );
});


module.exports = router;