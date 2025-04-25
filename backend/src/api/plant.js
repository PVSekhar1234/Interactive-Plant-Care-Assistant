const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Plant.id API details
const PLANT_ID_API_URL = "https://api.plant.id/v3/identification";
const HEALTH_API_URL = "https://api.plant.id/v3/health_assessment";
const PLANT_ID_API_KEY = process.env.PLANT_ID_API_KEY;

// Convert image to Base64
function bufferToBase64(buffer) {
    return buffer.toString("base64");
}

// Plant identification endpoint
router.post("/identify", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded." });
    }

    const base64Image = bufferToBase64(req.file.buffer);

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
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 3);

        const formattedSuggestions = plantSuggestions.map((plant) => ({
            id: plant.id,
            name: plant.name,
            probability: plant.probability,
            similar_images: plant.similar_images.map(img => img.url)
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

// Health assessment endpoint
router.post("/health", upload.single("image"), async (req, res) => {
    console.log("Received request for plant health check.");
  
    if (!req.file) {
      console.error("No image file found in request.");
      return res.status(400).json({ error: "No image uploaded." });
    }
  
    const base64Image = bufferToBase64(req.file.buffer);

    if (!base64Image) {
      console.error("Failed to encode image to Base64.");
      return res.status(500).json({ error: "Failed to process image." });
    }
  
    try {
      console.log("Sending image to Plant.id health assessment API...");
      const requestBody = {
          images: [base64Image],
      };
      const response = await axios.post(
        `${HEALTH_API_URL}?details=local_name,description,url,treatment,classification,common_names,cause`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Key": PLANT_ID_API_KEY,
          },
        }
      );
  
      console.log("Health API response received: ", response.data);
      const healthAssessment = response.data.result;
  
      res.json({ health_assessment: healthAssessment });
    } catch (error) {
      console.error("Error from Plant.id Health API:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to analyze plant health." });
    }
});  

module.exports = router;
