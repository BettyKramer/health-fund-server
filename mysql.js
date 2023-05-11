const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'betty',
  password: 'betty',
  database: 'healthfunddb'
});


module.exports = { con };