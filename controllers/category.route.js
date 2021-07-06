const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', function(req, res) {
    const list = categoryModel.all(); //View model



    res.render('vwCategories/index', { // Controller
        categories: list,
        empty: list.length === 0
    });


});

router.get('/about', function(req, res) {
    res.render('vwCategories/about');
})

router.post('/add', function(req, res) {
    const new_category = {
        CatID: -1,
        CatName: req.body.txtCatName
    };


    categoryModel.add(new_category);
    res.render('vwCategories/add');

})

module.exports = router;