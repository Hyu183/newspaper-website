const db = require('../database/db');
const tagModel = require('../models/tag.model');

const addArticle = (article, tags) =>
{
    let tagList = tags;
    if (tagList){
        tagList = tags.split('|');
    }
    else
        tagList = [];
    console.log("taglist", tagList);
    return db('articles').insert(article).then( articleID => {
        tagList.forEach(tag => {
            console.log(tag);
            db.select("id")
            .from("tags")
            .where("tag_name", tag)
            .then(tagList => {
                if (tagList.length === 0) {
                    tagModel.add(tag)
                    .then( (tagId) => {
                        //console.log(tagId, articleID);
                        tagModel.addTagArticles(tagId, articleID).then(()=> console.log("add tag article"));
                    });
                }
                else{
                    console.log("add tag existed");
                    tagModel.addTagArticles(tagList[0], articleID);
                }
            });
        });
    });
}

module.exports = {
    addArticle
};