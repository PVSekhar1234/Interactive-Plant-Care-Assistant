const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  const { temperature, humidity } = req.body;

  try {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(req.file.path));

    const response = await axios.post("http://localhost:5001/predict", formData, {
      headers: formData.getHeaders()
    });

    const result = response.data;
    result.temperature = temperature;
    result.humidity = humidity;

    // You can modify suggestion based on weather here
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Prediction failed." });
  }
});

module.exports = router;
