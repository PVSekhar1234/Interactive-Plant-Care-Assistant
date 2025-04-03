const dotenv = require("dotenv");
dotenv.config();

const fetch = require('node-fetch').default; // Correct way to import fetch in Node.js

// Replace with your OpenWeatherMap API key
const userApi = process.env.WEATHER_API_KEY;

async function getWeather(location) {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${userApi}&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log("API Response:", data); // Debugging step

        // Check if the API response contains an error
        if (data.cod !== 200) {
            console.log(`Error: ${data.message}`);
            return;
        }

        // Extract weather details
        const tempCity = data.main.temp.toFixed(2);  // Already in Celsius (°C)
        const weatherDesc = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed.toFixed(2);  // Already in m/s

        const dateTime = new Date().toLocaleString();

        console.log("-------------------------------------------------------------");
        console.log(`Weather Stats for - ${location.toUpperCase()}  || ${dateTime}`);
        console.log("-------------------------------------------------------------");
        console.log(`Current temperature is: ${tempCity}°C`);
        console.log(`Current weather desc  : ${weatherDesc}`);
        console.log(`Current Humidity      : ${humidity}%`);
        console.log(`Current wind speed    : ${windSpeed} m/s`);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Example usage
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question("Enter the city name: ", (location) => {
    getWeather(location);
    readline.close();
});
