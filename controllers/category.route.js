const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

// router.get('/', function(req, res) {
//     const list = categoryModel.all(); //View model



//     res.render('vwCategories/index', { // Controller
//         categories: list,
//         empty: list.length === 0
//     });


// });

router.get('/getCategoryData', async function(req, res) {
    const list = await categoryModel.all();
    console.log(list);
})


router.get('/', function(req, res) {
    res.render('vwCategories/index');
})

router.get('/about', function(req, res) {
    res.render('vwCategories/about');
})

router.get('/details', function(req, res) {
    res.render('vwCategories/details');
});

router.get('/category', function(req, res) {
    res.render('vwCategories/category');
});

router.get('/latest_news', function(req, res) {
    res.render('vwCategories/latest_news');
});

router.get('/sign_in', function(req, res) {
    res.render('vwCategories/sign_in');
});

router.get('/register', function(req, res) {
    res.render('vwCategories/register');
});

router.post('/add', function(req, res) {
    const new_category = {
        CatID: -1,
        CatName: req.body.txtCatName
    };


    categoryModel.add(new_category);
    res.render('vwCategories/add');

})

module.exports = router;