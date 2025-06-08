// db.js
const { Database } = require("@sqlitecloud/drivers");

// Conexión 
const db = new Database(
  "sqlitecloud://cbagzkibhz.g6.sqlite.cloud:8860/SubeDataBase?apikey=FaWiXBQPOKqzbrCHAE9G7iZ5qGaaV85rkdWTDbHwnwQ"
);

module.exports = db;
