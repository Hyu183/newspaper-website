const db = require('../database/db');

const addArticle = (article, tags) =>
{
    console.log("adding article");
    return db('articles').insert(article);
}

module.exports = {
    addArticle
};