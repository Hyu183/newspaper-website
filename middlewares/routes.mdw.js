module.exports = function (app){
    //Đường dẫn final bằng app.use + router.get
    app.use('/', require('../controllers/category.route'));
    app.use('/admin', require('../controllers/admin.route'));
    app.use('/user', require('../controllers/user.route'));
}