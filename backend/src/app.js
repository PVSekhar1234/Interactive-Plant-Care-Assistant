const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");

const plantRoutes = require("./api/plant");
const calendarRoutes = require("./api/calendar");
const weatherRoutes = require("./api/weather");
const chatbotRoutes = require("./api/chatbot");

dotenv.config();

const app = express();

// Load frontend origin from .env
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

console.log("CLIENT_ORIGIN:", CLIENT_ORIGIN);

// Enable CORS for specified frontend
app.use(cors({
    origin: "http://localhost:3000", 
    methods: "*", // Allows all HTTP methods
    allowedHeaders: "*", // Allows all headers
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/api/test", (req, res) => {
    res.json({ message: "CORS test success" });
});

// API routes
app.use("/api/plant", plantRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/gpt", require("./api/gpt"));
app.use("/api/chatbot", chatbotRoutes);

// Proxy chat route to local/internal chatbot
app.post("/api/chat", async (req, res) => {
    try {
        const { prompt } = req.body;
        const backendUrl = process.env.INTERNAL_API_URL || ""; // fallback to same host
        const response = await axios.post(`${backendUrl}/chat`, { prompt });
        res.json(response.data);
    } catch (error) {
        console.error("Chatbot proxy error:", error.message);
        res.status(500).json({ error: "Error communicating with chatbot API" });
    }
});

module.exports = app;
