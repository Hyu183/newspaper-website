const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : '1234',
      database : 'newspaperdb',
      port: 3306
    },
    pool: { min: 0, max: 7 }
  });

module.exports = knex;