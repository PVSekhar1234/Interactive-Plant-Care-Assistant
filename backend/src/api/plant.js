const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Convert image to Base64
function encodeImageToBase64(filePath) {
    try {
        const imageBuffer = fs.readFileSync(filePath);
        return imageBuffer.toString("base64");
    } catch (error) {
        console.error("Error reading image file:", error);
        return null;
    }
}

// Plant.id API details (Use your own API key)
const PLANT_ID_API_URL = "https://api.plant.id/v3/identification";
const PLANT_ID_API_KEY = process.env.PLANT_ID_API_KEY; // Store API key in .env

// Endpoint to handle image upload and identification
router.post("/identify", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded." });
    }

    const imagePath = req.file.path;
    console.log("Uploaded Image Path:", imagePath);

    const base64Image = encodeImageToBase64(imagePath);
    if (!base64Image) {
        return res.status(500).json({ error: "Failed to process image." });
    }

    try {
        const response = await axios.post(
            PLANT_ID_API_URL,
            {
                images: [base64Image],
                latitude: null, 
                longitude: null,
                similar_images: true
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": PLANT_ID_API_KEY
                }
            }
        );

        // Extract and sort by probability
        let plantSuggestions = response.data.result.classification.suggestions
            .sort((a, b) => b.probability - a.probability) // Sort descending
            .slice(0, 3) // Take top 3

        // Format the output
        const formattedSuggestions = plantSuggestions.map((plant) => ({
            id: plant.id,
            name: plant.name,
            probability: plant.probability,
            similar_images: plant.similar_images.map(img => img.url) // Small image URLs only
        }));

        const isPlant = response.data.result.is_plant.binary;
        const plantProbability = response.data.result.is_plant.probability;

        res.json({
            message: "Plant identified successfully",
            isPlant,
            plantProbability,
            suggestions: formattedSuggestions
        });

    } catch (error) {
        console.error("Error from Plant.id API:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to identify plant." });
    }
});

module.exports = router;
