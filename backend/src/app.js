const express = require("express");
const plantRoutes = require("./api/plant"); // Import router
const calendarRoutes = require("./api/calendar");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors()); // Allow all origins

app.use(cors({ origin: "http://localhost:3000",  methods: "GET,POST,PUT,DELETE", credentials: true }));

// Use plant identification routes
app.use("/api/plant", plantRoutes);

app.use("/api/calendar", calendarRoutes);

module.exports = app;
