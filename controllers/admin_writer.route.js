const express = require('express');
const moment = require('moment');
const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs');



const router = express.Router();

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

module.exports = router;