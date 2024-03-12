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

app.get("/connect", async (req, res) => {
  try {
    const connection = await connectDB();

    res.status(200).json({ message: "Connected to MySQL database" });
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
    res.status(500).json({ error: "Failed to connect to MySQL database" });
  }
});

module.exports = { app };