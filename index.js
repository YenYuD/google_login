const express = require("express");
const app = express();
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
const db = require(__dirname + "/modules/mysql-connect");
const cookieSession = require("cookie-session");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
var bodyParser = require("body-parser");
const add = require("./routes/add");
const flash = require("connect-flash");

dotenv.config();

require("./config/passport"); //passport.use的部分會被貼到這邊來，不需給變數

//====SQL database ====

//===SQL database ====

//===SQL database ===

//===SQL database ===

function isLoggedin(req, res, next) {
    req.user ? next() : res.status(401);
}

//middleWare
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//request會去檢查middleware中有沒有/，再去判斷你要/login還是還是/google

app.use(express.static("public"));

// app.use(
//     cookieSession({
//         keys: [process.env.SECRET],
//     })
// );

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");

    next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoute);
app.use("/profile", profileRoute);
app.use("/member", add);

app.get("/", (req, res) => {
    res.render("index", { user: req.user });
});

app.listen(3000, () => {
    console.log("server running 3000");
});
