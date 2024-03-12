// const mysql = require("mysql2");
// const fs = require("fs");

// function createConnection() {
//   return mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_PORT,
//   });
// }

// function connect(connection) {
//   connection.connect((err) => {
//     if (err) {
//       console.error("Error connecting to MySQL: ", err);
//       return;
//     }
//     console.log("Connected to MySQL database");

//     // Check if categories table exists, if not, create it
//     connection.query(
//       `CREATE TABLE IF NOT EXISTS categories (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL
//       )`,
//       (error) => {
//         if (error) {
//           console.error("Error creating categories table: ", error);
//         } else {
//           console.log("Categories table created or already exists");
//         }
//       }
//     );

//     // Check if products table exists, if not, create it
//     connection.query(
//       `CREATE TABLE IF NOT EXISTS products (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         category_id INT NOT NULL,
//         FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
//       )`,
//       (error) => {
//         if (error) {
//           console.error("Error creating products table: ", error);
//         } else {
//           console.log("Products table created or already exists");
//         }
//       }
//     );
//   });

//   connection.on("error", function (err) {
//     console.error("MySQL connection error:", err);
//     if (err.code === "PROTOCOL_CONNECTION_LOST") {
//       console.error("Reconnecting to MySQL...");
//       connection = createConnection();
//       connect(connection);
//     } else {
//       throw err;
//     }
//   });
// }

// module.exports = { createConnection, connect };

const mysql = require("mysql2");
const fs = require("fs");

function createPool() {
  return mysql.createPool({
    connectionLimit: 10,
    connectTimeout: 5000, // Adjust this value as needed
    waitForConnections: true, // Adjust this value as needed
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  });
}

function connect(pool) {
  pool.getConnection((err, connection) => {
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

    connection.release(); // Release the connection back to the pool
  });

  pool.on("error", function (err) {
    console.error("MySQL pool error:", err);
    // Handle pool errors gracefully, you might want to implement reconnection logic here
  });
}

module.exports = { createPool, connect };
