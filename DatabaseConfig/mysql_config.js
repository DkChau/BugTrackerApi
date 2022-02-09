var mysql = require('mysql')

require('dotenv').config();

const con = mysql.createPool({
    connectionLimit : 100,
    host: process.env.HOST_KEY,
    user: process.env.USERNAME_KEY,
    password: process.env.PASSWORD_KEY,
    database:process.env.DATABASE_KEY,
});

exports.con=con;