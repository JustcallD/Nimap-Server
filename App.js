const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const app = express();

// Apply middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MySQL
const connection = db.createConnection();
db.connect(connection);

// routes imports
const categoriesRouter = require("./Routes/Category");
const productsRouter = require("./Routes/Product");

app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);

app.get("/", (req, res) => {
  res.send("server running");
});


module.exports = { app };