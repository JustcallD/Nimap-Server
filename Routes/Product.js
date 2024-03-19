const express = require("express");
const router = express.Router();
const db = require("../db");

const connection = db.createConnection();

db.connect(connection);

// Create a product
router.post("/", (req, res) => {
  const { name, categoryId } = req.body;

  const finalCategoryId = categoryId || 1;

  connection.query(
    "SELECT * FROM categories WHERE id = ?",
    [finalCategoryId],
    (selectError, selectResults) => {
      if (selectError) {
        res.status(500).json({ error: "Failed to add product" });
        return;
      }

      if (selectResults.length === 0) {
        connection.query(
          "SELECT * FROM categories WHERE id = 1",
          (defaultCategoryError, defaultCategoryResults) => {
            if (defaultCategoryError) {
              res.status(500).json({ error: "Failed to add product" });
              return;
            }

            if (defaultCategoryResults.length === 0) {
              connection.query(
                "INSERT INTO categories (id, name) VALUES (1, 'Default')",
                (insertError, insertResults) => {
                  if (insertError) {
                    res.status(500).json({ error: "Failed to add product" });
                    return;
                  }

                  addProduct(name, 1);
                }
              );
            } else {
              addProduct(name, 1);
            }
          }
        );
      } else {
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
          res.status(500).json({ error: "Failed to add product" });
          return;
        }

        res.status(201).json({ message: "Product added successfully" });
      }
    );
  }
});

// Update a product
router.patch("/:id", (req, res) => {
  const productId = req.params.id;
  const { name, categoryId } = req.body;
  connection.query(
    "UPDATE products SET name = ?, category_id = ? WHERE id = ?",
    [name, categoryId, productId],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Failed to update product" });
        return;
      }
      res.status(200).json({ message: "Product updated successfully" });
    }
  );
});

// Get all products with associated category details
router.get("/", async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const offset = (page - 1) * pageSize;

  if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
    return res
      .status(400)
      .json({ error: "Invalid page or pageSize parameter" });
  }

  connection.query(
    "SELECT COUNT(*) AS total FROM products",
    (countError, countResults) => {
      if (countError) {
        console.error("Error executing count query:", countError);
        return res.status(500).json({ error: "Failed to fetch product count" });
      }

      const totalCount = countResults[0].total;

      connection.query(
        "SELECT p.*, c.id AS category_id, c.name AS category_name FROM products p INNER JOIN categories c ON p.category_id = c.id LIMIT ? OFFSET ?",
        [pageSize, offset],
        (error, results) => {
          if (error) {
            console.error("Error executing product query:", error);
            return res.status(500).json({ error: "Failed to fetch products" });
          }
          console.log("result", results);
          res.status(200).json({ products: results, total: totalCount });
        }
      );
    }
  );
});

// Delete a product
router.delete("/:id", (req, res) => {
  const productId = req.params.id;
  connection.query(
    "DELETE FROM products WHERE id = ?",
    [productId],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Failed to delete product" });
        return;
      }
      res.status(200).json({ message: "Product deleted successfully" });
    }
  );
});

module.exports = router;
