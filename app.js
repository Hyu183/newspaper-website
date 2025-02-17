const express = require("express");
const morgan = require("morgan");
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const initializeFacebookPassport = require("./public/js/config/auth.facebook.js");
const initializePassport = require("./public/js/config/passport.config");
const cookieParser = require("cookie-parser");

const app = express();
//app.use(cookieParser());
initializePassport(passport);
app.use(flash());
app.use(
  session({
    name: "sid",
    secret: "my $%^secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 10,
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
// app.use((req, res, next) => {
//     console.log(req.session);
//     console.log(req.user);
//     next();
// })

//app.use(fileUpload());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("/public", express.static(__dirname + "/public"));

app.use("/module", express.static(path.join(__dirname, "node_modules")));

//initializeFacebookPassport(passport);

app.use("/public", express.static(__dirname + "/public"));

app.use(
  express.urlencoded({
    //Cho phép controller nhận dữ liệu do form gửi về
    extended: true,
  })
);

require("./middlewares/view.mdw")(app);
require("./middlewares/locals.mdw")(app);
require("./middlewares/routes.mdw")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(
    `Online Newspaper Web App listening at ${process.env.HOST}:${PORT}`
  );
});
