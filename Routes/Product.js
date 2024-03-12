// const express = require("express");
// const router = express.Router();
// const db = require("../db");

// const connection = db.createConnection();

// db.connect(connection);

// // Create a product
// router.post("/", (req, res) => {
//   const { name, categoryId } = req.body;

//   const finalCategoryId = categoryId || 1;

//   connection.query(
//     "SELECT * FROM categories WHERE id = ?",
//     [finalCategoryId],
//     (selectError, selectResults) => {
//       if (selectError) {
//         console.error("Error checking category: ", selectError);
//         res.status(500).json({ error: "Failed to add product" });
//         return;
//       }

//       if (selectResults.length === 0) {
        
//         connection.query(
//           "SELECT * FROM categories WHERE id = 1",
//           (defaultCategoryError, defaultCategoryResults) => {
//             if (defaultCategoryError) {
//               console.error(
//                 "Error checking default category: ",
//                 defaultCategoryError
//               );
//               res.status(500).json({ error: "Failed to add product" });
//               return;
//             }

//             if (defaultCategoryResults.length === 0) {
            
//               connection.query(
//                 "INSERT INTO categories (id, name) VALUES (1, 'Default')",
//                 (insertError, insertResults) => {
//                   if (insertError) {
//                     console.error(
//                       "Error adding default category: ",
//                       insertError
//                     );
//                     res.status(500).json({ error: "Failed to add product" });
//                     return;
//                   }
                 
//                   addProduct(name, 1);
//                 }
//               );
//             } else {
              
//               addProduct(name, 1);
//             }
//           }
//         );
//       } else {
        
//         addProduct(name, finalCategoryId);
//       }
//     }
//   );

//   // Function to add the product to the database
//   function addProduct(name, categoryId) {
//     connection.query(
//       "INSERT INTO products (name, category_id) VALUES (?, ?)",
//       [name, categoryId],
//       (error, results) => {
//         if (error) {
//           console.error("Error adding product: ", error);
//           res.status(500).json({ error: "Failed to add product" });
//           return;
//         }

//         res.status(201).json({ message: "Product added successfully" });
//       }
//     );
//   }
// });

// // Update a product
// router.patch("/:id", (req, res) => {
//   const productId = req.params.id;
//   const { name, categoryId } = req.body;
//   connection.query(
//     "UPDATE products SET name = ?, category_id = ? WHERE id = ?",
//     [name, categoryId, productId],
//     (error, results) => {
//       if (error) {
//         console.error("Error updating product: ", error);
//         res.status(500).json({ error: "Failed to update product" });
//         return;
//       }
//       res.status(200).json({ message: "Product updated successfully" });
//     }
//   );
// });

// // Get all products with associated category details
// router.get("/", (req, res) => {

//   connection.query(
//     "SELECT COUNT(*) AS total FROM products",
//     (countError, countResults) => {
//       if (countError) {
//         console.error("Error fetching total count of products: ", countError);
//         res.status(500).json({ error: "Failed to fetch products" });
//         return;
//       }

//       const totalCount = countResults[0].total;

//       connection.query(
//         "SELECT p.*, c.id AS category_id, c.name AS category_name FROM products p INNER JOIN categories c ON p.category_id = c.id",
//         (error, results) => {
//           if (error) {
//             console.error("Error fetching products: ", error);
//             res.status(500).json({ error: "Failed to fetch products" });
//             return;
//           }
//           res.status(200).json({ products: results, total: totalCount });
//         }
//       );
//     }
//   );
// });

// // Delete a product
// router.delete("/:id", (req, res) => {
//   const productId = req.params.id;
//   connection.query(
//     "DELETE FROM products WHERE id = ?",
//     [productId],
//     (error, results) => {
//       if (error) {
//         console.error("Error deleting product: ", error);
//         res.status(500).json({ error: "Failed to delete product" });
//         return;
//       }
//       res.status(200).json({ message: "Product deleted successfully" });
//     }
//   );
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../db");

// No need to create connection here

// Create a product
router.post("/", (req, res) => {
  const { name, categoryId } = req.body;

  const finalCategoryId = categoryId || 1;

  db.pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error getting connection from pool:", error);
      res.status(500).json({ error: "Failed to add product" });
      return;
    }

    connection.query(
      "SELECT * FROM categories WHERE id = ?",
      [finalCategoryId],
      (selectError, selectResults) => {
        if (selectError) {
          console.error("Error checking category: ", selectError);
          connection.release(); // Release the connection back to the pool
          res.status(500).json({ error: "Failed to add product" });
          return;
        }

        if (selectResults.length === 0) {
          connection.query(
            "SELECT * FROM categories WHERE id = 1",
            (defaultCategoryError, defaultCategoryResults) => {
              if (defaultCategoryError) {
                console.error(
                  "Error checking default category: ",
                  defaultCategoryError
                );
                connection.release(); // Release the connection back to the pool
                res.status(500).json({ error: "Failed to add product" });
                return;
              }

              if (defaultCategoryResults.length === 0) {
                connection.query(
                  "INSERT INTO categories (id, name) VALUES (1, 'Default')",
                  (insertError, insertResults) => {
                    connection.release(); // Release the connection back to the pool
                    if (insertError) {
                      console.error(
                        "Error adding default category: ",
                        insertError
                      );
                      res.status(500).json({ error: "Failed to add product" });
                      return;
                    }
                    addProduct(name, 1);
                  }
                );
              } else {
                connection.release(); // Release the connection back to the pool
                addProduct(name, 1);
              }
            }
          );
        } else {
          connection.release(); // Release the connection back to the pool
          addProduct(name, finalCategoryId);
        }
      }
    );

    // Function to add the product to the database
    function addProduct(name, categoryId) {
      connection.query(
        "INSERT INTO products (name, category_id) VALUES (?, ?)",
        [name, categoryId],
        (error, results) => {
          if (error) {
            console.error("Error adding product: ", error);
            res.status(500).json({ error: "Failed to add product" });
            return;
          }

          res.status(201).json({ message: "Product added successfully" });
        }
      );
    }
  });
});

// Update a product
router.patch("/:id", (req, res) => {
  const productId = req.params.id;
  const { name, categoryId } = req.body;

  db.pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error getting connection from pool:", error);
      res.status(500).json({ error: "Failed to update product" });
      return;
    }

    connection.query(
      "UPDATE products SET name = ?, category_id = ? WHERE id = ?",
      [name, categoryId, productId],
      (error, results) => {
        connection.release(); // Release the connection back to the pool
        if (error) {
          console.error("Error updating product: ", error);
          res.status(500).json({ error: "Failed to update product" });
          return;
        }
        res.status(200).json({ message: "Product updated successfully" });
      }
    );
  });
});

// Get all products with associated category details
router.get("/", (req, res) => {
  db.pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error getting connection from pool:", error);
      res.status(500).json({ error: "Failed to fetch products" });
      return;
    }

    connection.query(
      "SELECT COUNT(*) AS total FROM products",
      (countError, countResults) => {
        if (countError) {
          console.error(
            "Error fetching total count of products: ",
            countError
          );
          connection.release(); // Release the connection back to the pool
          res.status(500).json({ error: "Failed to fetch products" });
          return;
        }

        const totalCount = countResults[0].total;

        connection.query(
          "SELECT p.*, c.id AS category_id, c.name AS category_name FROM products p INNER JOIN categories c ON p.category_id = c.id",
          (error, results) => {
            connection.release(); // Release the connection back to the pool
            if (error) {
              console.error("Error fetching products: ", error);
              res.status(500).json({ error: "Failed to fetch products" });
              return;
            }
            res.status(200).json({ products: results, total: totalCount });
          }
        );
      }
    );
  });
});

// Delete a product
router.delete("/:id", (req, res) => {
  const productId = req.params.id;

  db.pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error getting connection from pool:", error);
      res.status(500).json({ error: "Failed to delete product" });
      return;
    }

    connection.query(
      "DELETE FROM products WHERE id = ?",
      [productId],
      (error, results) => {
        connection.release(); // Release the connection back to the pool
        if (error) {
          console.error("Error deleting product: ", error);
          res.status(500).json({ error: "Failed to delete product" });
          return;
        }
        res.status(200).json({ message: "Product deleted successfully" });
      }
    );
  });
});

module.exports = router;
