const express = require("express");
const cors = require("cors");
require("dotenv").config();
const knexConfig = require('./knexfile'); 
const knex = require('knex')(knexConfig);
const { Model } = require('objection');


const auth= require("./routes/auth");
const user = require("./routes/user");
const validateToken = require("./middlewares/validateToken");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // Adjust the size limit as needed

// Initialize Objection with Knex
Model.knex(knex);

// Routes
app.use("/auth", auth);
app.use("/users", user);

// Protected route example
app.get("/api/protected-data", validateToken, (req, res) => {
  res.json({ message: "This is protected data, token is valid." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong.", error: err.stack });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
