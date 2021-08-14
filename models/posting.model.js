const db = require('../database/db');
const tagModel = require('../models/tag.model');
const moment = require('moment');

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

const checkStatusArticle = (is_approved, published_date)=>{
    switch (is_approved){
        case null:
            return "Chưa duyệt";            
        case 0:
            return "Bị từ chối";
        case 1:
            const publishedDate = moment(published_date);
            const today = moment();
            const diffTime = publishedDate.diff(today);

            return diffTime <= 0? "Đã xuất bản": "Chờ xuất bản";            
    }
}

module.exports = {
    addArticle,
    checkStatusArticle,
    getArticleList(){                           
        return db({a: 'articles'})
                .select('a.id','a.title','a.category_id',{cat_title:'c.title'},'c.parent_title','app.is_approved', 'app.published_date')
                .leftJoin({app: 'approval'},'app.article_id','=','a.id')
                .join(db.select('c1.id','c1.title',{parent_title:'c2.title'})
                        .from({c1:'category'})
                        .leftJoin({c2:'category'},'c1.parent_id','=','c2.id')
                        .as('c')
                        ,'c.id','=','a.category_id');              
    },

    getWaitingArticlesByAuthorID(authorID){
        return db({a: 'articles'})
            .select('a.id','a.title',{cat_title:'c.title'},'c.parent_title')
            .whereNotIn('a.id', db('approval')
                                .select('article_id')
                                )
            .andWhere('a.author_id',authorID)
            .join(db.select('c1.id','c1.title',{parent_title:'c2.title'})
                    .from({c1:'category'})
                    .leftJoin({c2:'category'},'c1.parent_id','=','c2.id')
                    .as('c')
                    ,'c.id','=','a.category_id');      
    },

    getRejectedArticlesByAuthorID(authorID){
        return db({a: 'articles'})
                .select('a.id','a.title',{cat_title:'c.title'},'c.parent_title')
                .join({app:'approval'},'app.article_id','=','a.id')
                .where('a.author_id',authorID)
                .andWhere('app.')
                .join(db.select('c1.id','c1.title',{parent_title:'c2.title'})
                        .from({c1:'category'})
                        .leftJoin({c2:'category'},'c1.parent_id','=','c2.id')
                        .as('c')
                        ,'c.id','=','a.category_id');      
    },

    async findByID(articleID){
        const rows = await db({a: 'articles'})
                            .select('a.id','a.title','a.category_id',{cat_title:'c.title'},'c.parent_title','app.is_approved', 'app.published_date')
                            .leftJoin({app: 'approval'},'app.article_id','=','a.id')
                            .join(db.select('c1.id','c1.title',{parent_title:'c2.title'})
                                    .from({c1:'category'})
                                    .leftJoin({c2:'category'},'c1.parent_id','=','c2.id')
                                    .as('c')
                                    ,'c.id','=','a.category_id')
                            .where('a.id',articleID)
        if(rows.length === 0){
            return null;
        }  
        return rows[0];
    },

    async findAuthorByArticleID(id){
        const rows = await db({a:'articles'})
                .select('u.id','u.name')
                .join({u: 'users'},'u.id','=','a.author_id')
                .where('a.id',id);
        return rows[0];
    },

    async findEditorByArticleID(id){
        const rows = await db({app:'approval'})
                        .select('u.id','u.name')
                        .join({u: 'users'},'u.id','=','app.editor_id')
                        .where('app.article_id',id);
        return rows[0];
    },

    patchCategory(articleID,catID){  
        return db('articles')
            .where( 'id', articleID)
            .update({category_id: catID});
    },
    
    patchPublishDate(articleID, updatedDate){
        return db('approval') 
                .where('article_id',articleID)
                .update({published_date:updatedDate})
    },

    addApproval(articleID,editorID,publish_date,approved_date){
        return db('approval')            
            .insert({
                article_id: articleID,
                editor_id: editorID,
                is_approved: 1,
                published_date: publish_date,
                approved_date: approved_date});
    },

    addTagList(tagList,articleID){        
        tagList.forEach(async tag => {
            console.log(tag);
            await db.select("id")
            .from("tags")
            .where("tag_name", tag)
            .then(async tagList => {
                if (tagList.length === 0) {
                    await tagModel.add(tag)
                    .then(async (tagID) => {
                        console.log(tagID[0], articleID);
                        await tagModel.addTagArticles(tagID[0], articleID).then(()=> console.log("add tag article"));
                        //tagModel.addTagArticles(tagId, articleID).then(()=> console.log("add tag article"));
                    });
                }
                else{
                    console.log("add tag existed");
                    console.log(tagList[0].id,articleID);
                    try {
                        await tagModel.addTagArticles(tagList[0].id, articleID);                        
                    } catch (error) {
                        console.log("existed");
                    }
                }
            });
        });
        return 0;
    },

    async delArticle(articleID){
        //del article tags
        await db('article_tags')
                .where( {article_id: articleID})               
                .del()
                .then(()=>{
                    console.log("del article tags");
                });

        //del approval
        await db('approval')
                .where({article_id: articleID})
                .del()
                .then(()=>{
                    console.log("del approval");
                })

        //del article
        return await db('articles')
                .where({id: articleID})
                .del()
                .then(()=>{
                    console.log("del article");
                })
    }
};