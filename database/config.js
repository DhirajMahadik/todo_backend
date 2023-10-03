const mysql = require('mysql2')

const connect = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Developer@0000',
    database:'todo_app'
})

module.exports = connect