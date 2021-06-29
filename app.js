const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));

app.engine('hbs', exphbs({
    // defaultLayout: 'main.hbs'
    defaultLayout: 'bs4.hbs'
}));
app.set('view engine', 'hbs');

app.get('/', function(req, res) {

    res.render('home');
});

// app.get('/about', function(req, res) {
//     res.render('about');
// });

app.get('/bs4', function(req, res) {
    res.sendFile(__dirname + '/bs4.html');
});

app.get('/homepage', function(req, res) {
    res.sendFile(__dirname + '/homepage.html');
});

const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Online Newspaper listening at http://localhost:${PORT}`);
});