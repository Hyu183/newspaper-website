const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');
const path = require('path');
const {addArticle} = require('../models/posting.model');
const categoryModel = require('../models/category.model');



router.get('/posting', async function(req, res) {
    const mainCategories = await categoryModel.allMainCategories();
    const subCategories = await categoryModel.allSubCategories();

    res.render('vwWriter/posting.hbs', {mainCategories: mainCategories, subCategories: subCategories});
});

router.post('/post_article', (req, res) => {
    // source: https://raddy.co.uk/blog/upload-and-store-images-in-mysql-using-node-js-express-express-fileupload-express-handlebars/
    let image;
    let uploadPath;

    console.log(req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    image = req.files.thumbnail_image;
    const relativePath = 'public/article_img/' + image.name;
    uploadPath = path.join(__dirname, '../public/article_img/', image.name);

    // Use mv() to place file on the server
    image.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        });


    console.log(req.body);
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
                   
                    res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
                }
            });
        });
       } catch (error) {
           console.log(error.message);
       }
})

module.exports = router;
