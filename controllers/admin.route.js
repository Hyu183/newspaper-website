const express = require('express');
// const categoryModel = require('../models/category.model');

const router = express.Router();


// router.get('/getCategoryData', async function(req, res) {
//     const list = await categoryModel.all();
//     console.log(list);
// })

router.get('/',function(req,res){
    res.render('vwAdmin/users', {layout: 'admin.hbs'});
})

router.get('/tags',function(req,res){
    res.render('vwAdmin/tags', {layout: 'admin.hbs'});
})

router.get('/posts',function(req,res){
    res.render('vwAdmin/posts', {layout: 'admin.hbs'});
})

router.get('/categories',function(req,res){
    res.render('vwAdmin/categories', {layout: 'admin.hbs'});
})

module.exports = router;