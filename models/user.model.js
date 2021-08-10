const db = require('../database/db');

const addUser = (user) => {
    console.log("adding user");
    return db('users').insert(user);
};

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/sign_in');
}

const checkNotAuthenticated = (req, res, next) => {
    console.log("here12");
    if (req.isAuthenticated()){
        res.redirect('/');
    }
    return next();
}

module.exports = {
    addUser,
    async findByUsername(username){
        const rows = await db('users').where('user_name', username);
         if(rows.length===0){
            return null;
         }
         return rows[0];
     },

     async getUserbyId(id){
        const rows = await db('users').where('id', id);
         if(rows.length===0){
            return null;
         }
         return rows[0];
     },

     checkAuthenticated,
     checkNotAuthenticated
};