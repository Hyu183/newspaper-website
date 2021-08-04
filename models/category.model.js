const db = require('../database/db');

module.exports = {  

    all() {
        return db.select().from('category');
    },

    allMainCategories(){
        return db.select()
                .from('category')
                .whereNull('parent_id');
    },

    allSubCategories(){
        return db.select()
                .from('category')
                .whereNotNull('parent_id');
    },

    add(category) {
        return db('category').insert(category);
    },

    findByParentID(parent_id){
        return db('category')
                .where('parent_id',parent_id);
    }
};