const express = require("express");

const router = express.Router();

const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
});

// For pool initialization, see above
pool.getConnection(function (err, conn) {
    // Do something with the connection
    if (err) {
        console.log(err);
    } else {
        // Don't forget to release the connection when finished!
        console.log("DB connected successfully");
        pool.releaseConnection(conn);
    }
});

router.get("/register", (req, res, next) => {
    pool.query("SELECT * FROM `zipcode` WHERE 1", function (err, data) {
        // console.log(data);
        const city = data
            .map((item) => item.City)
            .reduce((accu, item) => {
                if (!accu.includes(item)) {
                    accu.push(item);
                }
                return accu;
            }, []);
        console.log(city);
        res.render("drop-down-menu", {
            title: "address",
            city_data: city,
            data: data,
        });
    });
});

module.exports = router;
