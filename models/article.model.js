const db = require('../database/db');
const moment = require('moment');
module.exports = {
  all() {
    return db('articles');
  },

  async getTopWeek(){
    const time = moment().subtract(7, 'days').format('YYYY/MM/DD');
    const sql = `SELECT a.*, c.title as category_name FROM articles a, category c
    WHERE created_time > '${time}' and a.category_id = c.id
    order by view_number desc
    limit 4`
    const rs = await db.raw(sql);
    return rs[0] || [];
  },
  async getTopViews(){
    const sql = `SELECT a.*, c.title as category_name FROM articles a, category c
    WHERE a.category_id = c.id
    order by view_number desc
    limit 10`
    const rs = await db.raw(sql);
    return rs[0] || [];
  },
  async getMostRecent(){
    const sql = `SELECT a.*, c.title as category_name FROM articles a, category c
    WHERE a.category_id = c.id
    order by created_time desc
    limit 10`
    const rs = await db.raw(sql);
    return rs[0] || [];
  },
  async getTop10Cats(){
    const sql = `SELECT a.category_id as id, c.title as name FROM articles a, category c
    WHERE a.category_id = c.id
    group by category_id, c.title
    order by count(a.id) desc
    limit 10`
    const rs = await db.raw(sql);
    return rs[0] || [];
  },
  async getArticleOfTop10Cats(top10Cats){
    const sql = (catID) => `SELECT id, title, created_time, thumbnail_image FROM articles
    WHERE category_id = ${catID}
    order by created_time desc
    limit 4`
    await Promise.all(top10Cats.map(async (cat) => {
      const rs = await db.raw(sql(cat.id));
      cat.articles = rs[0];
    }));
    return top10Cats;
  },


};