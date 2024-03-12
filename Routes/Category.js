const express = require("express");
const router = express.Router();
const db = require("../db");

const connection = db.createConnection();

db.connect(connection);

// POST categories
router.post("/", (req, res) => {
  const { name } = req.body;

  connection.query(
    "SELECT * FROM categories WHERE id = 1",
    (selectError, selectResults) => {
      if (selectError) {
        console.error("Error checking default category: ", selectError);
        res.status(500).json({ error: "Failed to add category" });
        return;
      }

      if (selectResults.length === 0) {
        connection.query(
          "INSERT INTO categories (id, name) VALUES (1, 'Default')",
          (insertError, insertResults) => {
            if (insertError) {
              console.error("Error adding default category: ", insertError);
              res.status(500).json({ error: "Failed to add category" });
              return;
            }
            res.status(201).json({ message: "Category added successfully" });
          }
        );
      } else {
        connection.query(
          "INSERT INTO categories (name) VALUES (?)",
          [name],
          (error, results) => {
            if (error) {
              console.error("Error adding category: ", error);
              res.status(500).json({ error: "Failed to add category" });
              return;
            }
            res.status(201).json({ message: "Category added successfully" });
          }
        );
      }
    }
  );
});

// Get all categories
router.get("/", (req, res) => {
  connection.query("SELECT * FROM categories", (error, results) => {
    if (error) {
      console.error("Error fetching categories: ", error);
      res.status(500).json({ error: "Failed to fetch categories" });
      return;
    }
    res.status(200).json(results);
  });
});

// Update category by ID
router.patch("/:id", (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  if (categoryId === "1") {
    res.status(400).json({ error: "Default category cannot be updated" });
    return;
  }

  connection.query(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, categoryId],
    (error, results) => {
      if (error) {
        console.error("Error updating category: ", error);
        res.status(500).json({ error: "Failed to update category" });
        return;
      }
      res.status(200).json({ message: "Category updated successfully" });
    }
  );
});

// Delete category by ID
router.delete("/:id", (req, res) => {
  const categoryId = req.params.id;
  if (categoryId === "1") {
    res.status(400).json({ error: "Default category cannot be deleted" });
    return;
  }

  // Delete the category
  connection.query(
    "DELETE FROM categories WHERE id = ?",
    [categoryId],
    (error, results) => {
      if (error) {
        console.error("Error deleting category: ", error);
        res.status(500).json({ error: "Failed to delete category" });
        return;
      }

      // If the category is deleted successfully, update the products with default category
      connection.query(
        "UPDATE products SET category_id = 1 WHERE category_id = ?",
        [categoryId],
        (updateError, updateResults) => {
          if (updateError) {
            console.error(
              "Error updating products after category deletion: ",
              updateError
            );
            res.status(500).json({ error: "Failed to update products" });
            return;
          }
          res.status(200).json({ message: "Category deleted successfully" });
        }
      );
    }
  );
});
module.exports = router;
