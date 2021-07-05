const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs'
}));
app.set('view engine', 'hbs');


app.use(express.urlencoded({ //Cho phép controller nhận dữ liệu do form gửi về
    extended: true
}));

app.get('/', function(req, res) {

    res.render('index');
});



app.get('/about', function(req, res) {
    res.render('about');
});

//Đường dẫn final bằng app.use + router.get
app.use('/admin/categories/', require('./controllers/category.route'));



const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Online Newspaper Web App listening at http://localhost:${PORT}`);
});