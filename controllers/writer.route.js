const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');

router.get('/posting', function(req, res) {
    res.render('vwWriter/posting.hbs');
});

router.post('/post_article', (req, res) => {
    console.log(req.body);
});

router.post('/upload_img', multipartMiddleware, (req, res) => {
    try {
        fs.readFile(req.files.upload.path, function (err, data) {
            console.log(req.files.upload);
            let newPath = req.files.upload.path;
            fs.writeFile(newPath, data, function (err) {
                if (err) console.log({err: err});
                else {
                    console.log(req.files.upload.originalFilename);                 
                    let fileName = req.files.upload.name;
                    let url = '/article_img/'+fileName;                    
                    let msg = 'Upload successfully';
                    let funcNum = req.query.CKEditorFuncNum;
                    console.log({url,msg,funcNum});
                   
                    res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
                }
            });
        });
       } catch (error) {
           console.log(error.message);
       }
})

module.exports = router;
