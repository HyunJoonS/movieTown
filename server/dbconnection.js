//데이터베이스 연결
const conf = require('./config.js');
const mysql     = require('mysql2');
const session   = require('express-session')
const MySQLStore = require('express-mysql-session')(session);


const options= {
    host: conf.DB_HOST,
    user: conf.DB_USER,
    password: conf.DB_PW,
    port: conf.DB_PORT,
    database: conf.DB,
    dateStrings: 'date'
}

const connection = mysql.createPool(options);
const sessionStore = new MySQLStore(options);
// connection.connect((err)=>{
//     if(err) throw err;
// });


module.exports.connection = connection;
module.exports.sessionStore = sessionStore;