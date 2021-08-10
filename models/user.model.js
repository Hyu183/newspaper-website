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
     checkNotAuthenticated,

    async findByID(id){
        const rows = await db('users')
                            .select('id','user_name','name','email','birthday','subcription_due_date')
                            .where('id', id);
            if(rows.length===0){
                return null;
            }
            return rows[0];
    },

    addPenName(writer){
        return db('reporters').insert(writer);
    },

    async findPenNameByID(id){
        const rows = await db('reporters').where('user_id', id);
            if(rows.length===0){
                return null;
            }
            return rows[0].pen_name;
    },

    patchPenName(writer){
        const id = writer.user_id;
        delete writer.user_id;
        
        return db('reporters')
            .where( 'user_id', id)
            .update(writer);
    },

    delPenName(id){
        return db('reporters')
            .where( 'user_id', id)
            .del();
    },

    allUserByType(type){
       return db('users')
                .select('id','user_name','name','email','subcription_due_date')
                .where('user_type', type);
    },

    allWriter(){
        return db.select('u.id','u.user_name','u.name','u.email','r.pen_name')
                .from({u:'users'})
                .leftJoin({r:'reporters'},'u.id','=','r.user_id')
                .where('u.user_type',1);
    },

    patch(updatedUser){
        const id = updatedUser.id;
        delete updatedUser.id;
        
        return db('users')
            .where( 'id', id)
            .update(updatedUser);
    },

    del(id){
        return db('users')
            .where( 'id', id)
            .del();
    },
};