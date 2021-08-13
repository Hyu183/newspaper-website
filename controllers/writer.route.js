const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');
const path = require('path');
const {addArticle} = require('../models/posting.model');
const categoryModel = require('../models/category.model');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname,'../public/article_img'))
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage});


router.get('/posting', async function(req, res) {
    const mainCategories = await categoryModel.allMainCategories();
    const subCategories = await categoryModel.allSubCategories();

    res.render('vwWriter/posting.hbs', {mainCategories: mainCategories, subCategories: subCategories});
});

router.post('/post_article', (req, res) => {
    let relativePath;
    upload.single('thumbnail_image')(req, res, function (err) {
        console.log('body', req.body);
        if (err instanceof multer.MulterError) {
            console.log(err);
        } else if (err) {
            console.log(err);
        }
            relativePath = 'public/article_img/' + req.file.filename;
            console.log(req.body);
            if (article['category_id'] === -1){
                article['category_id'] = article['main_category_id'];
            }
            let article = req.body;
            let tags = article['tag'];
            delete article['tag'];
            delete article['main_category_id'];
        
            article['thumbnail_image'] = relativePath;
        
            article['created_time'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
            article['author_id'] = 1;
        
            addArticle(article, tags).then
            (
                () => {
                    console.log("success posting article");
                    console.log(article);
                    res.redirect('/posting');
                }
            ).catch( (err) =>
                {
                    console.log(err);
                    return;
                }        
            );
    })
});

router.post('/upload_img', (req, res) => {
    upload.single('upload')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
        } else if (err) {
            console.log(err);
        }
            console.log(req.file);
            let filename = req.file.filename;
            let url = '/article_img/' + filename;                    
            let msg = 'Upload successfully';
            let funcNum = req.query.CKEditorFuncNum;
            res.status(200).json(
            {
                uploaded: 1,
                fileName: filename,
                url: url
            });
    })
})

module.exports = router;
