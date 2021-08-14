const express = require('express');
const categoryModel = require('../models/category.model');
const articleModel = require('../models/article.model');
const router = express.Router();
const moment = require('moment');
moment.updateLocale('en', {
  relativeTime : {
      future: "trong %s",
      past:   "%s trước",
      s  : 'Vài giây trước',
      ss : '%d giây',
      m:  "1 phút",
      mm: "%d phút",
      h:  "1 giờ",
      hh: "%d giờ",
      d:  "1 ngày",
      dd: "%d ngày",
      w:  "1 tuần",
      ww: "%d tuần",
      M:  "1 tháng",
      MM: "%d tháng",
      y:  "1 năm",
      yy: "%d năm"
  }
});


router.get('/getCategoryData', async function(req, res) {
    const list = await categoryModel.all();
    console.log(list);
})



router.get('/about', function(req, res) {
    res.render('vwCategories/about');
})

router.get('/details', function(req, res) {
    res.render('vwCategories/details');
});

router.get('/category', function(req, res) {
    res.render('vwCategories/category');
});

router.get('/latest_news', function(req, res) {
    res.render('vwCategories/latest_news');
});

router.post('/add', function(req, res) {
    const new_category = {
        CatID: -1,
        CatName: req.body.txtCatName
    };


    categoryModel.add(new_category);
    res.render('vwCategories/add');

})

router.get('/editor', function(req, res) {
    res.render('vwEditor/editor');
})

router.get('/editorPostList', function(req, res) {
    res.render('vwEditor/editorPostList');
})

router.get('/writer', function(req, res) {
    res.render('vwWriter/writer');
})

router.get('/posting', function(req, res) {
    res.render('vwWriter/posting');
})

router.get('/articles/:id', async (req, res) => {
  const id = +req.params.id || 0;
  const article = await articleModel.findByID(id);
  if(!article){
    res.redirect('/');
  }
  const currentUser = await req.user;
  const loggedIn  = !!currentUser;
  const randomArticles = await articleModel.getRandomArticlesFromCategory(article.category_id);
  article.numOfCmt = article.comments.length;
  res.render('vwCategories/details', {
    article,
    randomArticles,
    currentUser,
    loggedIn
  });
})

router.post('/articles/add-comment', async (req, res) => {
  const {content, commenter_id, article_id} = req.body;
  const post_time = moment().format('YYYY-MM-DD hh:mm:ss');
  await articleModel.addComment({content, commenter_id, article_id, post_time})
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