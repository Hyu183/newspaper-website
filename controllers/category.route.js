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

router.get('/userInfo', function(req, res) {
    res.render('vwCategories/userInfo');
});

router.post('/add', function(req, res) {
    const new_category = {
        CatID: -1,
        CatName: req.body.txtCatName
    };


    categoryModel.add(new_category);
    res.render('vwCategories/add');

})

router.get('/editor', function(req, res) {
    res.render('vwEditor/editor');
})

router.get('/editorPostList', function(req, res) {
    res.render('vwEditor/editorPostList');
})

router.get('/writer', function(req, res) {
    res.render('vwWriter/writer');
})

router.get('/posting', function(req, res) {
    res.render('vwWriter/posting');
})

module.exports = router;