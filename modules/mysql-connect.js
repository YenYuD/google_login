//==SQL database==//
require("dotenv").config();

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

// pool.connect(function (err) {
//     if (err) {
//         throw err;
//     } else {
//         console.log(" DB connected successfully");
//     }
// });

module.exports = pool.promise();
