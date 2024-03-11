const express = require("express");
const cors = require("cors");

const app = express();

// Apply middleware
app.use(
  cors({ origin: ["*", "https://nimap-task.netlify.app"], credentials: true })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes imports
const categoriesRouter = require("./Routes/Category");
const productsRouter = require("./Routes/Product");

app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.get("/", (req, res) => {
  res.send("server running");
});

module.exports = { app };
// https://nimap-task.netlify.app
