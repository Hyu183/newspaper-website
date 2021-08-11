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
// router.get('/', function(req, res) {
//     const list = categoryModel.all(); //View model



//     res.render('vwCategories/index', { // Controller
//         categories: list,
//         empty: list.length === 0
//     });


// });

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

router.get('/userInfo', function(req, res) {
    res.render('vwCategories/userInfo');
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