const categoryModel = require('../models/category.model');

module.exports = function(app){
    app.use(async function(req,res,next){
        // const categories = await categoryModel.all();
        // const mainCategories = await categoryModel.allMainCategories();
        // for(c of mainCategories){
        //     const subCat = await categoryModel.findByParentID(c.id);
        //     c.subCat = subCat;
        // }
        
        // res.locals.lcCategories = categories;
        // res.locals.lcMainCategories = mainCategories;
        // next();
        const categories = await categoryModel.all();
        const mainCategories = await categoryModel.allMainCategories();
        for(c of mainCategories){
            const subCat = await categoryModel.findByParentID(c.id);
            c.subCat = subCat;
        }
        
        res.locals.lcCategories = categories;
        res.locals.lcMainCategories = mainCategories;
        next();
    })
}