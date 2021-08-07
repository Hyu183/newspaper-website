const db = require('../database/db');
const moment = require('moment');
module.exports = {
  all() {
    return db('articles');
  },

  async getTopWeek(){
    const time = moment().subtract(7, 'days').format('YYYY/MM/DD');
    const sql = `SELECT * FROM articles
    WHERE created_time > '${time}'
    order by view_number desc
    limit 4`
    const rs = await db.raw(sql);
    return rs[0] || [];
  }
};