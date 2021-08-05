const db = require('../database/db');

module.exports = {  

    all() {
        return db.select().from('tags');
    },
  
    add(tag) {
        return db('tags').insert(tag);
    },

    async findByID(id){
        const rows = await db('tags')
                    .where('id',id);
        if(rows.length === 0){
            return null;
        }
    
        return rows[0];
    },

    patch(tag){
        const id = tag.id;
        delete tag.id;
        
        return db('tags')
            .where( 'id', id)
            .update(tag);
    },

    del(id){
        return db('tags')
            .where( 'id', id)
            .del();
    },

};