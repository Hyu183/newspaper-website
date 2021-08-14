const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const moment = require('moment');
module.exports = function(app){
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        helpers:{
            section: hbs_sections(),
            formatTime(sqlDateTime){
              return moment(sqlDateTime, 'YYYY/MM/DD').format('DD/MM/YYYY')
            },
            timeFromNow(sqlDateTime){
             return moment(sqlDateTime, 'YYYY-MM-DD hh:mm:ss').fromNow();
            },
            formatTimeWithHour(sqlDateTime){
              return moment(sqlDateTime, 'YYYY/MM/DD').format('MMMM DD YYYY, h:mm a');
            }
        }
    }));
    app.set('view engine', 'hbs');
}