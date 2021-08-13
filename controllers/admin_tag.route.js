const express = require('express');
const tagModel = require('../models/tag.model');

const router = express.Router();


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

    const tag = req.body.tag_name;
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

module.exports = router;