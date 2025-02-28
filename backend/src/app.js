const express = require("express");
const plantRoutes = require("./api/plant"); // Import router
const calendarRoutes = require("./api/calendar");
const app = express();
app.use(express.json());

// Use plant identification routes
app.use("/api/plant", plantRoutes);

app.use("/api/calendar", calendarRoutes);

module.exports = app;
