const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();


// router.get('/getCategoryData', async function(req, res) {
//     const list = await categoryModel.all();
//     console.log(list);
// })

router.get('/',function(req,res){
    res.render('vwAdmin/users', {
        layout: 'admin.hbs',
        userActive: true
    });
})

router.get('/tags',function(req,res){
    res.render('vwAdmin/tags', {
        layout: 'admin.hbs',
        tagActive: true
    });
})

router.get('/posts',function(req,res){
    res.render('vwAdmin/posts', {
        layout: 'admin.hbs',
        postActive: true
    });
})

router.get('/categories',async function(req,res){
    //const categories = await categoryModel.all();

    res.render('vwAdmin/categories', {
        layout: 'admin.hbs',
        categoryActive: true,
       // categories
    });
})

router.get('/categories/add',async function(req,res){
    //const mainCategories = await categoryModel.allMainCategories();
    res.render('vwAdmin/addCategory', {
        layout: 'admin.hbs',
        categoryActive: true,
        //mainCategories
    });
})

router.get('/is-category-available',async function(req,res){
    const title = req.query.title;
    const parent_id = req.query.parent_id;
    const list = await categoryModel.findByParentID(parent_id);
    let titles = []
    for( c of list){
        titles.push(c.title.toLowerCase());
    }

    res.json(!titles.includes(title.toLowerCase()));
})

router.post('/categories/add',async function(req,res){
    const new_category = req.body;
    await categoryModel.add(new_category);
    
    //const mainCategories = await categoryModel.allMainCategories();
    res.render('vwAdmin/addCategory', {
        layout: 'admin.hbs',
        categoryActive: true,
        //mainCategories
    });
})

module.exports = router;