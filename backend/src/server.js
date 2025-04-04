const app = require("./app");
require("dotenv").config(); 

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const axios = require("axios");


app.use(cors());
app.use(express.json());

// Route to interact with Python chatbot
app.post("/api/chat", async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await axios.post("http://localhost:8000/chat", { prompt });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error communicating with chatbot API" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
