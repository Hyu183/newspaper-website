const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/categories', async function (req, res) {

    res.render('vwAdmin/categories', {
        layout: 'admin.hbs',
        categoryActive: true,
    });
})

router.get('/categories/add', async function (req, res) {
    
    res.render('vwAdmin/addCategory', {
        layout: 'admin.hbs',
        categoryActive: true,
    });
})

router.get('/is-category-available', async function (req, res) {
    const title = req.query.title;
    const parent_id = req.query.parent_id;
    const list = await categoryModel.findByParentID(parent_id);
    let titles = []
    for (c of list) {
        titles.push(c.title.toLowerCase());
    }

    res.json(!titles.includes(title.toLowerCase()));
})

router.post('/categories/add', async function (req, res) {
    const new_category = req.body;
    await categoryModel.add(new_category);
    
    res.redirect('/admin/categories/add');
})

router.get('/categories/edit', async function (req, res) {

    const category_id = req.query.id;
    const categoryDetail = await categoryModel.findByID(category_id);

    if (categoryDetail === null) {
        return res.redirect('/admin/categories');
    }
    const isNotParent = categoryDetail.parent_title === 'Không' ? false : true;

    res.render('vwAdmin/editCategory', {
        layout: 'admin.hbs',
        categoryActive: true,
        categoryDetail,
        isNotParent
    });
})

router.post('/categories/patch', async function (req, res) {

    const updatedCategory ={
        id: req.query.id,
        title: req.body.title
    }

    await categoryModel.patch(updatedCategory);

    res.redirect('/admin/categories');
})

router.post('/categories/del', async function (req, res) {

    await categoryModel.del(req.query.id);

    res.redirect('/admin/categories');
})


module.exports = router;