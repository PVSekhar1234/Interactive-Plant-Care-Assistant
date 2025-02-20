const express = require("express");
const plantRoutes = require("./api/plant"); // Import router

const app = express();
app.use(express.json());

// Use plant identification routes
app.use("/api/plant", plantRoutes);

module.exports = app;
