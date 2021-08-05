const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(morgan('dev'));

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