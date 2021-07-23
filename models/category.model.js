const db = require('../database/db');

module.exports = {  

    all() {
        return db.select().from('category');
    },

    add(category) {
        list.push(category);
    }
};