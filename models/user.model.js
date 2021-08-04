const db = require('../database/db');

const addUser = (user) => {
    console.log("adding user");
    return db('users').insert(user);
};

module.exports = {
    addUser
};