const express = require("express");
const router = express.Router();
const Category = require("../Schema/category");
const Product = require("../Schema/product");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new category
router.post("/", async (req, res) => {
  const category = new Category({
    name: req.body.name,
  });
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a category
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const defaultCategoryId = await Category.findOne({ name: "Default" });

    if (!defaultCategoryId) {
      throw new Error("Default category not found");
    }

    if (defaultCategoryId._id.toString() === id) {
      throw new Error("Cannot delete the default category");
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
        },
      },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a category
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const defaultCategoryId = await Category.findOne({ name: "Default" });

    if (!defaultCategoryId) {
      throw new Error("Default category not found");
    }

    if (defaultCategoryId._id.toString() === id) {
      throw new Error("Cannot delete the default category");
    }
    await Category.findByIdAndDelete(id);
    const productsToUpdate = await Product.find({ categoryId: id });
    const defaultCategory = await Category.findOne({ name: "Default" });

    await Promise.all(
      productsToUpdate.map(async (product) => {
        product.categoryId = defaultCategory._id;
        await product.save();
      })
    );

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
