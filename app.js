const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const hbs_sections = require('express-handlebars-sections');

const app = express();
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    helpers:{
        section: hbs_sections()
    }
}));
app.set('view engine', 'hbs');


app.use(express.urlencoded({ //Cho phép controller nhận dữ liệu do form gửi về
    extended: true
}));

//Đường dẫn final bằng app.use + router.get
app.use('/', require('./controllers/category.route'));



const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Online Newspaper Web App listening at http://localhost:${PORT}`);
});