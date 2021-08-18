const express = require('express');
const categoryModel = require('../models/category.model');
const articleModel = require('../models/article.model');
const router = express.Router();
const moment = require('moment');
const tagModel = require('../models/tag.model');
moment.updateLocale('en', {
    relativeTime: {
        future: "trong %s",
        past: "%s trước",
        s: 'Vài giây trước',
        ss: '%d giây',
        m: "1 phút",
        mm: "%d phút",
        h: "1 giờ",
        hh: "%d giờ",
        d: "1 ngày",
        dd: "%d ngày",
        w: "1 tuần",
        ww: "%d tuần",
        M: "1 tháng",
        MM: "%d tháng",
        y: "1 năm",
        yy: "%d năm"
    }
});


router.get('/tags/:id', async function(req, res) {
    const tagID = +req.params.id || 0;

    const tag = await tagModel.findByID(tagID)
    if (!tag) {
        res.redirect('/');
    }

    const limit = 6;
    let page = req.query.page || 1;
    if (page < 1) page = 1;

    const total = await articleModel.countByTagID(tagID);
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrent: i === +page
        });
    }

    const offset = (page - 1) * limit;
    const list = await articleModel.findByTagID(tagID, offset);
    await Promise.all(list.map(async(a) => {
        const rs = await articleModel.getArticleTags(a.id);
        a.tags = rs;
    }))

    res.render('vwCategories/byTag', {
        tag,
        articles: list,
        empty: list.length === 0,
        page_numbers
    });
});

router.get('/categories/:id', async function(req, res) {
    const catID = +req.params.id || 0;

    const category = await categoryModel.findByID(catID);
    if (!category) {
        res.redirect('/');
    }

    const limit = 6;
    let page = req.query.page || 1;
    if (page < 1) page = 1;

    const total = category.parent_id ? await articleModel.countByCatID(catID) :
        await articleModel.countByCatParentID(catID);
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrent: i === +page
        });
    }

    const offset = (page - 1) * limit;
    const list = category.parent_id ? await articleModel.findByCatID(catID, offset, limit) :
        await articleModel.findByCatParentID(catID, offset, limit);
    await Promise.all(list.map(async(a) => {
            const rs = await articleModel.getArticleTags(a.id);
            a.tags = rs;
        }))
        //console.log(total, list)
    res.render('vwCategories/byCat', {
        category,
        articles: list,
        empty: list.length === 0,
        page_numbers
    });
});

router.get('/search', async function(req, res) {
    const keyword = req.query.keyword;
    const list = await articleModel.search(keyword);
    await Promise.all(list.map(async(a) => {
        const rs = await articleModel.getArticleTags(a.id);
        a.tags = rs;
    }))

    //console.log(res.locals.lcMainCategories[0].subCat);
    res.render('vwCategories/search', {
        keyword,
        articles: list,
        empty: list.length === 0,
    });
});



router.get('/articles/:id', async(req, res) => {
    const id = +req.params.id || 0;
    const article = await articleModel.findByID(id);
    if (!article) {
        res.redirect('/');
    }
    const currentUser = await req.user;
    const loggedIn = !!currentUser;
    const randomArticles = await articleModel.getRandomArticlesFromCategory(article.category_id);
    article.numOfCmt = article.comments.length;
    res.render('vwCategories/details', {
        article,
        randomArticles,
        currentUser,
        loggedIn
    });
})

router.post('/articles/add-comment', async(req, res) => {
    const { content, commenter_id, article_id } = req.body;
    const post_time = moment().format('YYYY-MM-DD hh:mm:ss');
    await articleModel.addComment({ content, commenter_id, article_id, post_time })
    res.end();
})
router.get('/', async function(req, res) {
    const listTopWeek = await articleModel.getTopWeek();
    const top1Week = listTopWeek.pop();
    const listTopViews = await articleModel.getTopViews();
    const listMostRecent = await articleModel.getMostRecent();
    const listTop10Cats = await articleModel.getTop10Cats();
    const listArticleOfTop10Cats = await articleModel.getArticleOfTop10Cats(listTop10Cats);
    res.render('vwCategories/index', {
        top1Week,
        listTopWeek,
        listTopViews,
        listMostRecent,
        listArticleOfTop10Cats
    });
})
module.exports = router;