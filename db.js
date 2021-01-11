const mysql = require("mysql");
const dbcon =  mysql.createConnection({
    host: process.env.sources,
    user: process.env.name,
    password: process.env.pass,
    database: process.env.DATABASE   
   });

   module.exports =dbcon; 