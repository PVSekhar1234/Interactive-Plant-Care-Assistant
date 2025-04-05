const express = require("express");
const cors = require("cors");
const plantRoutes = require("./api/plant");
const calendarRoutes = require("./api/calendar");
const weatherRoutes = require("./api/weather");
const app = express();

// Enable CORS to allow frontend (React) to communicate with backend
app.use(cors({
    origin: "http://localhost:3000", // Allow only frontend origin
    methods: ["GET", "POST"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"] // Specify allowed headers
}));
app.use(express.json());
app.use(cors()); // Allow all origins

app.use(cors({ origin: "http://localhost:3000",  methods: "GET,POST,PUT,DELETE", credentials: true }));

// Use plant identification routes
app.use("/api/plant", plantRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/weather", weatherRoutes); // Use weather routes
app.use("/api/gpt", require("./api/gpt")); // Use GPT routes

module.exports = app;
