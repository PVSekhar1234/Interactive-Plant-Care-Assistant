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

// Plant.id API details
const PLANT_ID_API_URL = "https://api.plant.id/v3/identification";
const HEALTH_API_URL = "https://api.plant.id/v3/health_assessment";
const PLANT_ID_API_KEY = process.env.PLANT_ID_API_KEY;

// Plant identification endpoint
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

        // Delete the uploaded image
        fs.unlink(imagePath, (err) => {
            if (err) console.error("Error deleting uploaded file:", err);
            else console.log("Temporary file deleted:", imagePath);
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
  
    const imagePath = req.file.path;
    const plantName = req.body.plantName;
    console.log("Uploaded image path:", imagePath);
  
    const base64Image = encodeImageToBase64(imagePath);
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
        "https://plant.id/api/v3/health_assessment?details=local_name,description,url,treatment,classification,common_names,cause",
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
  
      // Cleanup
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting image:", err);
        else console.log("Temporary image deleted:", imagePath);
      });
    } catch (error) {
      console.error("Error from Plant.id Health API:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to analyze plant health." });
    }
});  

module.exports = router;
