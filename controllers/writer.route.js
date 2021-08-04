const express = require('express');
const router = express.Router();

router.get('/posting', function(req, res) {
    res.render('vwWriter/posting.hbs');
});

router.post('/post_article', (req, res) => {
    console.log(req.body);
});


module.exports = router;