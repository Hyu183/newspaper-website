const express = require('express');


const router = express.Router();

router.get('/posts', function (req, res) {
    res.render('vwAdmin/posts', {
        layout: 'admin.hbs',
        postActive: true
    });
})



module.exports = router;