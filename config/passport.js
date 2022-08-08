const dotenv = require("dotenv");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local");

// const db = require(__dirname + "/../modules/mysql-connect");

const mysql = require("mysql2");

// req.user;
// req.logout();
// req.isAuthenticated();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
});

passport.serializeUser(function (user, done) {
    console.log("serializing user now");
    // console.log(user);
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    console.log("deserializing user now");
    // console.log(obj);
    done(null, obj);
});

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use(
    "local-login",
    new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true, // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            // callback with email and password from our form

            connection.query(
                "SELECT * FROM ``memberdata` WHERE `m_email` = '" + email + "'",
                function (err, rows) {
                    if (err) return done(err);
                    if (!rows.length) {
                        return done(
                            null,
                            false,
                            req.flash("error_msg", "No user found.")
                        ); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong
                    if (!(rows[0].password == password))
                        return done(
                            null,
                            false,
                            req.flash("error_msg", "Oops! Wrong password.")
                        ); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, rows[0]);
                }
            );
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID, //google oauth ID
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, //google oauth secret
            passReqToCallback: true,
            callbackURL: "/auth/google/redirect", //用google登入後會進到的地方
        },

        function (request, accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                //Check whether the User exists or not using profile.id
                if (process.env.USE_DATABASE) {
                    // if sets to true
                    pool.query(
                        "SELECT * from memberdata WHERE m_google_id=" +
                            profile.id,
                        (err, rows) => {
                            if (err) throw err;
                            if (rows && rows.length === 0) {
                                console.log(
                                    "There is no such user, adding now"
                                );
                                pool.query(
                                    "INSERT into memberdata(m_google_id,m_google_username) VALUES('" +
                                        profile.id +
                                        "','" +
                                        profile.displayName +
                                        "')"
                                );
                            } else {
                                console.log("User already exists in database");
                            }
                        }
                    );
                }
                return done(null, profile);
            });
        }
    )
);
