var mysql = require('mysql')
const { promisify } = require('util')

require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.HOST_KEY,
    user: process.env.USERNAME_KEY,
    password: process.env.PASSWORD_KEY,
    database:process.env.DATABASE_KEY,
});

pool.query = promisify(pool.query).bind(pool)
module.exports = pool;