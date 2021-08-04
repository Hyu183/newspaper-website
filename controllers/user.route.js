const express = require('express');
const router = express.Router();


router.get('/sign_in', function(req, res) {
    console.log("ggwggr");
    res.render('vwCategories/sign_in');
});

router.get('/register', function(req, res) {
    res.render('vwCategories/register');
});

router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const userName = req.body.userName;
    const password = req.body.password;


    req.checkBody()
});


module.exports = router;