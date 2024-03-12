const mysql = require("mysql2");


function createConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
   
  });
}

function connect(connection) {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL: ", err);
      return;
    }
    console.log("Connected to MySQL database");

    // Check if categories table exists, if not, create it
    connection.query(
      `CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )`,
      (error) => {
        if (error) {
          console.error("Error creating categories table: ", error);
        } else {
          console.log("Categories table created or already exists");
        }
      }
    );

    // Check if products table exists, if not, create it
    connection.query(
      `CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category_id INT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )`,
      (error) => {
        if (error) {
          console.error("Error creating products table: ", error);
        } else {
          console.log("Products table created or already exists");
        }
      }
    );
  });
}

module.exports = { createConnection, connect };
