const express = require("express");
const router = express.Router();
const Product = require("../Schema/product");

// GET products with pagination
router.get("/", async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 5;
  const skip = (page - 1) * pageSize;
  try {
    const totalCount = await Product.countDocuments();
    const products = await Product.find()
      .skip(skip)
      .limit(pageSize)
      .populate("categoryId");
    res.json({ products: products, total: totalCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new product
router.post("/", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    categoryId: req.body.categoryId,
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
