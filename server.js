const express = require("express");
const lumie = require("lumie");
const Sequelize = require("sequelize");
const path = require("path");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000; // Use environment variable for the port if available
// Database connection
require("dotenv").config({ override: true });
global.CONSTANTS = require("./config/constants"); // Step 2: set global

// Middleware
app.use(express.json()); // Use express built-in JSON parser

// CORS settings
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Define your routes using Lumie
lumie.load(app, {
  preURL: "",
  verbose: true,
  // ignore: ["*.spec", "*.action"],
  controllers_path: path.join(__dirname, "controllers"),
});

// Start the server
app.listen(port, () => {
  console.log(process.env.NODE_ENV);
  console.log(`Onex API listening at http://localhost:${port}`);
});
