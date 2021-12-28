//데이터베이스 연결
const fs = require('fs');
const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');
const session    = require('express-session')

const options= {
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database,
    dateStrings: 'date'
}
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore(options);
const connection = mysql.createConnection(options);
connection.connect((err)=>{
    if(err) throw err;
});


module.exports.connection = connection;
module.exports.sessionStore = sessionStore;