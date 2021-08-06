const express = require('express');
const categoryModel = require('../models/category.model');
const tagModel = require('../models/tag.model');
const userModel = require('../models/user.model')


const router = express.Router();


// router.get('/getCategoryData', async function(req, res) {
//     const list = await categoryModel.all();
//     console.log(list);
// })

router.get('/users',function(req,res){
    res.render('vwAdmin/users', {
        layout: 'admin.hbs',
        userMenuActive: true,
        userActive: true
    });
})

router.get('/users/add',function(req,res){

    const url = req.headers.referer || '/';
    
    res.render('vwAdmin/addUser', {
        layout: 'admin.hbs',
        userMenuActive: true,
        userActive: true,
        url
    });
})

router.post('/users/add',function(req,res){

    console.log(req.body);

    res.render('vwAdmin/addUser', {
        layout: 'admin.hbs',
        userMenuActive: true,
        userActive: true
    });
})

router.get('/is-username-available',async function(req,res){
    const username = req.query.username;
    const user = await userModel.findByUsername(username);
    if(user===null){
        return res.json(true);
    }

    res.json(false);
})

router.get('/users/edit',function(req,res){

    

    res.render('vwAdmin/editUser', {
        layout: 'admin.hbs',
        userMenuActive: true,
        userActive: true
    });
})

router.post('/users/patch',function(req,res){
    console.log("patch");
    console.log(req.body);
    res.redirect('/admin/users');
})

router.post('/users/del',function(req,res){
    console.log("del");
    console.log(req.body);
    res.redirect('/admin/users');
})



router.get('/writers',function(req,res){
    res.render('vwAdmin/usersWriters', {
        layout: 'admin.hbs',
        userMenuActive: true,
        writerActive: true
    });
})

router.get('/writers/add',function(req,res){
    res.render('vwAdmin/addUserWriter', {
        layout: 'admin.hbs',
        userMenuActive: true,
        writerActive: true
    });
})

router.post('/writers/add',function(req,res){
   
    res.redirect('/admin/writers')
})
router.get('/editors',function(req,res){
    res.render('vwAdmin/usersEditors', {
        layout: 'admin.hbs',
        userMenuActive: true,
        editorActive: true
    });
})


router.get('/usersAdmin',function(req,res){
    res.render('vwAdmin/usersAdmin', {
        layout: 'admin.hbs',
        userMenuActive: true,
        userAdminActive: true
    });
})

router.get('/',async function(req,res){

    const tags = await tagModel.all();

    res.render('vwAdmin/tags', {
        layout: 'admin.hbs',
        tagActive: true,
        tags
    });
})
router.get('/tags/add',async function(req,res){

    res.render('vwAdmin/addTag', {
        layout: 'admin.hbs',
        tagActive: true
        
    });
})
router.post('/tags/add',async function(req,res){

    const tag = req.body;
    await tagModel.add(tag);

    res.redirect('/admin/tags/add');
})

router.get('/is-tag-available',async function(req,res){
    const tag_name = req.query.tag_name;
    const list = await tagModel.all();
    let tags = []
    for( c of list){
        tags.push(c.tag_name.toLowerCase());
    }

    res.json(!tags.includes(tag_name.toLowerCase()));
})

router.get('/tags/edit',async function(req,res){
   
    const tag_id = req.query.id;
    const tagDetail = await tagModel.findByID(tag_id); 

    if(tagDetail === null){
        return res.redirect('/admin');
    }
    res.render('vwAdmin/editTag', {
        layout: 'admin.hbs',
        tagActive: true,
        tagDetail
    });
})

router.post('/tags/patch',async function(req,res){

    
    await tagModel.patch(req.body);
 
    res.redirect('/admin');
})

router.post('/tags/del',async function(req,res){

    await tagModel.del(req.body.id);

    res.redirect('/admin');
})

router.get('/posts',function(req,res){
    res.render('vwAdmin/posts', {
        layout: 'admin.hbs',
        postActive: true
    });
})

router.get('/categories',async function(req,res){
   
    res.render('vwAdmin/categories', {
        layout: 'admin.hbs',
        categoryActive: true,
    });
})

router.get('/categories/add',async function(req,res){
    //const mainCategories = await categoryModel.allMainCategories();
    res.render('vwAdmin/addCategory', {
        layout: 'admin.hbs',
        categoryActive: true,
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
    res.redirect('/admin/categories/add');
})

router.get('/categories/edit',async function(req,res){
   
    const category_id = req.query.id;
    const categoryDetail = await categoryModel.findByID(category_id); 
    
    if(categoryDetail === null){
        return res.redirect('/admin/categories');
    }
    const isNotParent = categoryDetail.parent_title === 'Không'?false:true;
    
    res.render('vwAdmin/editCategory', {
        layout: 'admin.hbs',
        categoryActive: true,
        categoryDetail,
        isNotParent
    });
})

router.post('/categories/patch',async function(req,res){

    await categoryModel.patch(req.body);
 
    res.redirect('/admin/categories');
})

router.post('/categories/del',async function(req,res){

    await categoryModel.del(req.body.id);

    res.redirect('/admin/categories');
})


module.exports = router;