require('dotenv').config();
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  
  // connection.connect((err) => {
  //   if (err) {
  //     console.error('Error connecting to database: ' + err.stack);
  //     return;
  //   }
  //   console.log('Connected to database.');
  // });

module.exports = connection;