const express = require("express");
const cors = require("cors");
const plantRoutes = require("./api/plant");
const calendarRoutes = require("./api/calendar");
const chatbotRoutes = require("./api/chatbot");
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
app.use("/api/chatbot", chatbotRoutes);
app.post("/api/chat", async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await axios.post("http://localhost:5000/chat", { prompt });
        res.json(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error communicating with chatbot API" });
    }
});

module.exports = app;
