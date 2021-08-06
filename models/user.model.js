const db = require('../database/db');

const addUser = (user) => {
    console.log("adding user");
    return db('users').insert(user);
};

module.exports = {
    addUser,
    
    async findByUsername(username){
        const rows = await db('users').where('user_name', username);
         if(rows.length===0){
             return null;
         }
         return rows[0];
     },
};