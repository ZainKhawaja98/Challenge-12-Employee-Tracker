const util = require("util");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "employees"
});

connection.connect();
connection.query = util.promisify(connection.query);
module.exports = connection;