const categoryModel = require('../models/category.model');

module.exports = function(app){
    app.use(async function(req,res,next){
        const categories = await categoryModel.all();
        const mainCategories = await categoryModel.allMainCategories();

        res.locals.lcCategories = categories;
        res.locals.lcMainCategories = mainCategories;
        next();
    })
}