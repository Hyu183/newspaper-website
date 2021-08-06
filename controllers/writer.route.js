const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');
const path = require('path');
const {addArticle} = require('../models/posting.model');

router.get('/posting', function(req, res) {
    res.render('vwWriter/posting.hbs');
});

router.post('/post_article', (req, res) => {
    console.log(req.body);
    let article = req.body;
    let tags = article['tag'];
    delete article['tag'];

    article['created_time'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    article['author_id'] = 1;

    addArticle(article, tags).then
    (
        () => {
            console.log("success posting article")
            res.redirect('/posting');
        }
    ).catch( (err) =>
        {
            console.log(err);
            return;
        }        
    );;
});

router.post('/upload_img', multipartMiddleware, (req, res) => {
    // source: https://github.com/ReDoProgrammer/ckeditor_filebrowser/blob/main/app.js
    try {
        fs.readFile(req.files.upload.path, function (err, data) {
            console.log(req.files.upload);
            let newPath = path.join(__dirname, '../public/article_img/', req.files.upload.name);
            fs.writeFile(newPath, data, function (err) {
                if (err) console.log({err: err});
                else {
                    //console.log(req);                 
                    let fileName = req.files.upload.name;
                    let url = '/article_img/'+fileName;                    
                    let msg = 'Upload successfully';
                    let funcNum = req.query.CKEditorFuncNum;
                    //console.log({url,msg,funcNum});
                   
                    res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
                }
            });
        });
       } catch (error) {
           console.log(error.message);
       }
})

module.exports = router;
