const express = require('express');
const moment = require('moment');
const categoryModel = require('../models/category.model');
const tagModel = require('../models/tag.model');
const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs');



const router = express.Router();


router.get('/users', async function (req, res) {

    const userList = await userModel.allUserByType(0);

    const curTime = moment();

    for (u of userList) {

        const dueTime = moment(u.subcription_due_date);
        const diffTime = dueTime.diff(curTime, 'seconds');

        if (isNaN(diffTime) || diffTime < 0) {
            u.account_type = "Thường";
        }
        else {
            u.account_type = "Premium";
        }
    }


    res.render('vwAdmin/users', {
        layout: 'admin.hbs',
        userMenuActive: true,
        userActive: true,
        userList
    });
})

router.get('/users/add', function (req, res) {

    res.render('vwAdmin/addUser', {
        layout: 'admin.hbs',
        userMenuActive: true,
        userActive: true
    });
})

router.post('/users/add', function (req, res) {

    const hash = bcrypt.hashSync(req.body.raw_password, 10);

    const user = {
        user_name: req.body.user_name,
        password: hash,
        name: req.body.name,
        email: req.body.email,
        birthday: req.body.birthday,
        user_type: 0
    }

    userModel.addUser(user).then(
        () => {
            console.log("success")
        }
    ).catch((err) => {
        console.log(err);
    }
    );

    res.redirect('/admin/users/add');
})

router.get('/is-username-available', async function (req, res) {
    const username = req.query.username;
    const user = await userModel.findByUsername(username);
    if (user === null) {
        return res.json(true);
    }

    res.json(false);
})

router.get('/users/edit', async function (req, res) {

    const userDetail = await userModel.findByID(req.query.id);

    if (userDetail === null) {
        return res.redirect('/admin/users');
    }

    userDetail.birthday = moment(userDetail.birthday).format("YYYY-MM-DD");

    const dueTime = moment(userDetail.subcription_due_date);

    const curTime = moment();

    const diffTime = dueTime.diff(curTime, 'seconds');

    if (isNaN(diffTime) || diffTime < 0) {
        userDetail.subcription_due_date = "Đã hết hạn";
    }
    else {
        userDetail.subcription_due_date = dueTime.format("YYYY-MM-DD HH:mm:ss");
    }

    res.render('vwAdmin/editUser', {
        layout: 'admin.hbs',
        userMenuActive: true,
        userActive: true,
        userDetail
    });
})

router.post('/users/patch', async function (req, res) {
    console.log("patch");
    console.log(req.body);
    let updatedUser = {};
    if (req.body.newpass.length != 0) {
        const hash = bcrypt.hashSync(req.body.newpass, 10);
        updatedUser = {
            id: req.query.id,
            name: req.body.name,
            email: req.body.email,
            birthday: req.body.birthday,
            password: hash,
        }

    }
    else {
        updatedUser = {
            id: req.query.id,
            name: req.body.name,
            email: req.body.email,
            birthday: req.body.birthday,
        }
    }

    await userModel.patch(updatedUser);

    res.redirect('/admin/users');
})

router.post('/users/del', async function (req, res) {
    const userID = req.query.id;
    await userModel.del(userID);
    res.redirect('/admin/users');
})

router.post('/users/extendSubcription', async function (req, res) {

    const userID = req.query.id;
    const url = req.headers.referer || "/admin/users";

    const user = await userModel.findByID(userID);

    const dueTime = moment(user.subcription_due_date);

    const curTime = moment();

    const diffTime = dueTime.diff(curTime, 'seconds');

    let newDueTime = "";
    const day = 7;

    if (isNaN(diffTime) || diffTime < 0) {
        newDueTime = moment().add(day, 'days');
    }
    else {
        newDueTime = dueTime.add(day, 'days');
    }

    const extended = {
        id: userID,
        subcription_due_date: newDueTime.format("YYYY-MM-DD HH:mm:ss")
    }

    await userModel.patch(extended);

    res.redirect(url);
})

//-----------------------------------------------------------------------------------------------------------------------------------------

router.get('/writers', async function (req, res) {

    const writerList = await userModel.allWriter();

    res.render('vwAdmin/usersWriters', {
        layout: 'admin.hbs',
        userMenuActive: true,
        writerActive: true,
        writerList
    });
})

router.get('/writers/add', function (req, res) {
    res.render('vwAdmin/addUserWriter', {
        layout: 'admin.hbs',
        userMenuActive: true,
        writerActive: true
    });
})

router.post('/writers/add', async function (req, res) {

    const hash = bcrypt.hashSync(req.body.raw_password, 10);

    const user = {
        user_name: req.body.user_name,
        password: hash,
        name: req.body.name,
        email: req.body.email,
        birthday: req.body.birthday,
        user_type: 1
    }

    await userModel.add(user);

    const _user = await userModel.findByUsername(user.user_name);

    const writer = {
        user_id: _user.id,
        pen_name: req.body.penname
    }

    await userModel.addPenName(writer);

    res.redirect('/admin/writers/add')
})

router.get('/writers/edit', async function (req, res) {

    const userDetail = await userModel.findByID(req.query.id);

    if (userDetail === null) {
        return res.redirect('/admin/writers');
    }
    userDetail.birthday = moment(userDetail.birthday).format("YYYY-MM-DD");

    userDetail.pen_name = await userModel.findPenNameByID(req.query.id);

    console.log(userDetail);

    res.render('vwAdmin/editUserWriter', {
        layout: 'admin.hbs',
        userMenuActive: true,
        writerActive: true,
        userDetail
    });
})

router.post('/writers/patch', async function (req, res) {
    console.log("writer patch");

    let updatedUser = {};
    if (req.body.newpass.length != 0) {
        const hash = bcrypt.hashSync(req.body.newpass, 10);
        updatedUser = {
            id: req.query.id,
            name: req.body.name,
            email: req.body.email,
            birthday: req.body.birthday,
            password: hash,
        }

    }
    else {
        updatedUser = {
            id: req.query.id,
            name: req.body.name,
            email: req.body.email,
            birthday: req.body.birthday,
        }
    }

    //update in users table
    await userModel.patch(updatedUser);
    
    const writer = {
        user_id: req.query.id,
        pen_name: req.body.pen_name
    }
    
    //update pen_name
    await userModel.patchPenName(writer);
   

    res.redirect('/admin/writers');
})

router.post('/writers/del', async function (req, res) {
    const userID = req.query.id;
    await userModel.delPenName(userID);
    await userModel.del(userID);
    res.redirect('/admin/writers');
})
//-----------------------------------------------------------------------------------------------------------------------------------------

router.get('/editors', async function (req, res) {

    const editorList = await userModel.allUserByType(2);

    res.render('vwAdmin/usersEditors', {
        layout: 'admin.hbs',
        userMenuActive: true,
        editorActive: true,
        editorList
    });
})
router.get('/editors/add', function (req, res) {
    res.render('vwAdmin/addUserEditor', {
        layout: 'admin.hbs',
        userMenuActive: true,
        editorActive: true
    });
})
router.post('/editors/add', function (req, res) {
    const hash = bcrypt.hashSync(req.body.raw_password, 10);

    const user = {
        user_name: req.body.user_name,
        password: hash,
        name: req.body.name,
        email: req.body.email,
        birthday: req.body.birthday,
        user_type: 2
    }

    userModel.addUser(user).then(
        () => {
            console.log("success")
        }
    ).catch((err) => {
        console.log(err);
    }
    );



    res.redirect('/admin/editors/add');
})

router.get('/editors/edit', async function (req, res) {

    const userDetail = await userModel.findByID(req.query.id);

    if (userDetail === null) {
        return res.redirect('/admin/editors');
    }
    userDetail.birthday = moment(userDetail.birthday).format("YYYY-MM-DD");
    console.log(userDetail);

    res.render('vwAdmin/editUserEditor', {
        layout: 'admin.hbs',
        userMenuActive: true,
        editorActive: true,
        userDetail
    });
})

router.post('/editors/patch', async function (req, res) {
    console.log("editor patch");

    let updatedUser = {};
    if (req.body.newpass.length != 0) {
        const hash = bcrypt.hashSync(req.body.newpass, 10);
        updatedUser = {
            id: req.query.id,
            name: req.body.name,
            email: req.body.email,
            birthday: req.body.birthday,
            password: hash,
        }

    }
    else {
        updatedUser = {
            id: req.query.id,
            name: req.body.name,
            email: req.body.email,
            birthday: req.body.birthday,
        }
    }

    await userModel.patch(updatedUser);

    res.redirect('/admin/editors');
})

router.post('/editors/del', async function (req, res) {
    const userID = req.query.id;
    await userModel.del(userID);
    res.redirect('/admin/editors');
})
//-----------------------------------------------------------------------------------------------------------------------------------------

router.get('/usersAdmin', async function (req, res) {

    const adminList = await userModel.allUserByType(3);

    res.render('vwAdmin/usersAdmin', {
        layout: 'admin.hbs',
        userMenuActive: true,
        userAdminActive: true,
        adminList
    });
})

router.get('/usersAdmin/add', function (req, res) {
    res.render('vwAdmin/addUserAdmin', {
        layout: 'admin.hbs',
        userMenuActive: true,
        userAdminActive: true
    });
})

router.post('/usersAdmin/add', function (req, res) {
    const hash = bcrypt.hashSync(req.body.raw_password, 10);

    const user = {
        user_name: req.body.user_name,
        password: hash,
        name: req.body.name,
        email: req.body.email,
        birthday: req.body.birthday,
        user_type: 3
    }

    userModel.addUser(user).then(
        () => {
            console.log("success")
        }
    ).catch((err) => {
        console.log(err);
    }
    );

    res.redirect('/admin/usersAdmin/add');
})

router.get('/usersAdmin/edit', async function (req, res) {

    const userDetail = await userModel.findByID(req.query.id);

    if (userDetail === null) {
        return res.redirect('/admin/usersAdmin');
    }
    userDetail.birthday = moment(userDetail.birthday).format("YYYY-MM-DD");

    res.render('vwAdmin/editUserAdmin', {
        layout: 'admin.hbs',
        userMenuActive: true,
        userAdminActive: true,
        userDetail
    });
})

router.post('/usersAdmin/patch', async function (req, res) {
    console.log("usersAdmin patch");

    let updatedUser = {};
    if (req.body.newpass.length != 0) {
        const hash = bcrypt.hashSync(req.body.newpass, 10);
        updatedUser = {
            id: req.query.id,
            name: req.body.name,
            email: req.body.email,
            birthday: req.body.birthday,
            password: hash,
        }

    }
    else {
        updatedUser = {
            id: req.query.id,
            name: req.body.name,
            email: req.body.email,
            birthday: req.body.birthday,
        }
    }

    await userModel.patch(updatedUser);

    res.redirect('/admin/usersAdmin');
})

router.post('/usersAdmin/del', async function (req, res) {
    const userID = req.query.id;
    await userModel.del(userID);
    res.redirect('/admin/usersAdmin');
})
//-----------------------------------------------------------------------------------------------------------------------------------------

router.get('/', async function (req, res) {

    const tags = await tagModel.all();

    res.render('vwAdmin/tags', {
        layout: 'admin.hbs',
        tagActive: true,
        tags
    });
})
router.get('/tags/add', async function (req, res) {

    res.render('vwAdmin/addTag', {
        layout: 'admin.hbs',
        tagActive: true

    });
})
router.post('/tags/add', async function (req, res) {

    const tag = req.body;
    await tagModel.add(tag);

    res.redirect('/admin/tags/add');
})

router.get('/is-tag-available', async function (req, res) {
    const tag_name = req.query.tag_name;
    const list = await tagModel.all();
    let tags = []
    for (c of list) {
        tags.push(c.tag_name.toLowerCase());
    }

    res.json(!tags.includes(tag_name.toLowerCase()));
})

router.get('/tags/edit', async function (req, res) {

    const tag_id = req.query.id;
    const tagDetail = await tagModel.findByID(tag_id);

    if (tagDetail === null) {
        return res.redirect('/admin');
    }
    res.render('vwAdmin/editTag', {
        layout: 'admin.hbs',
        tagActive: true,
        tagDetail
    });
})

router.post('/tags/patch', async function (req, res) {

    const updatedTag = {
        id: req.query.id,
        tag_name: req.body.tag_name
    } 

    await tagModel.patch(updatedTag);

    res.redirect('/admin');
})

router.post('/tags/del', async function (req, res) {

    await tagModel.del(req.query.id);

    res.redirect('/admin');
})

//-----------------------------------------------------------------------------------------------------------------------------------------

router.get('/posts', function (req, res) {
    res.render('vwAdmin/posts', {
        layout: 'admin.hbs',
        postActive: true
    });
})

//-----------------------------------------------------------------------------------------------------------------------------------------

router.get('/categories', async function (req, res) {

    res.render('vwAdmin/categories', {
        layout: 'admin.hbs',
        categoryActive: true,
    });
})

router.get('/categories/add', async function (req, res) {
    //const mainCategories = await categoryModel.allMainCategories();
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

    //const mainCategories = await categoryModel.allMainCategories();
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