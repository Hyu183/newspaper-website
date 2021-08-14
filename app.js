const express = require('express');
const morgan = require('morgan');
const path = require('path');
//const fileUpload = require('express-fileupload');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');





const app = express();

app.use(flash());
app.use(session({
    name: 'sid',
    secret: 'my $%^secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 10,
        sameSite: true,
        secure: false
    }
}));
app.use(passport.initialize());
app.use(passport.session());

//app.use(fileUpload());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/module', express.static(path.join(__dirname, 'node_modules')))


app.use(express.urlencoded({ //Cho phép controller nhận dữ liệu do form gửi về
    extended: true
}));


require('./middlewares/view.mdw')(app);
require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);



const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Online Newspaper Web App listening at http://localhost:${PORT}`);
});