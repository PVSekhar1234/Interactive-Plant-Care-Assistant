const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Fetch Weather Data
router.get('/getweather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    const API_KEY = process.env.WEATHER_API_KEY;
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(URL);
        console.log("Full OpenWeatherMap Response:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

module.exports = router;