const express = require('express');
const moment = require('moment');
const userModel = require('../models/user.model')
const assignCatModel = require('../models/assignCat.model')
const bcrypt = require('bcryptjs');



const router = express.Router();

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

router.get('/editors/assign', async function (req, res) {

    const userDetail = await userModel.findByID(req.query.id);

    if (userDetail === null) {
        return res.redirect('/admin/editors');
    }

    const assignedCat = await assignCatModel.findByEditorID(req.query.id);
    const unassignedCat = await assignCatModel.findUnassignedCatByEditorID(req.query.id);
  
    res.render('vwAdmin/assignEditor', {
        layout: 'admin.hbs',
        userMenuActive: true,
        editorActive: true,
        userDetail,
        assignedCat,
        unassignedCat
    });
})

router.post('/editors/assign', async function (req, res) {
   
    const editorID = req.query.id;
   
    let deleteAssignedCat = req.body.deleteAssignedCat;

    let assignCat =req.body.assignCat;   
        

    let addList = [];
    if(typeof(assignCat) != 'undefined'){
        try {
            addList = assignCat.map(function(element){
                const obj = {
                    editor_id: editorID,
                    category_id: element
                }
                return obj;
            });
        } catch (error) {
            addList.push({
                editor_id: editorID,
                category_id: assignCat
            });
        }
    }

    
    if(typeof(deleteAssignedCat) !== 'undefined'){
        if(deleteAssignedCat.length === 1){
            let deleteList  = []
            deleteList.push(deleteAssignedCat);
            await assignCatModel.del(editorID,deleteList);
        }        
        else{
            await assignCatModel.del(editorID,deleteAssignedCat);
        }
    }    
    if(addList.length !== 0) await assignCatModel.add(addList);

    res.redirect('/admin/editors')
});


module.exports = router;