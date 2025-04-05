const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const axios = require("axios");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new OpenAI();

router.post("/", async (req, res) => {
    const { messages } = req.body;
    console.log("Request received at /api/chatbot: ", messages);

  try {
    // const response = await axios.post(
    //     "https://api.openai.com/v1/chat/completions",
    //     {
    //         model: "gpt-4o-mini", // Change to "gpt-3.5-turbo" if needed
    //         messages,
    //     },
    //     {
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    //         },
    //     }
    // );

    // const reply = response.data.choices[0].message.content;
    // res.json({ reply });
    // const response = client.responses.create({
    //     model: "gpt-4o",
    //     input: "Write a one-sentence bedtime story about a unicorn."
    // });
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Write a one-sentence bedtime story about a unicorn." }
        ]
      });
      
    console.log(response.choices[0].message);
    
  } catch (error) {
    console.error("Error from OpenAI API:", error);
    res.status(500).json({ error: "Failed to generate chatbot response." });
  }
});

module.exports = router;
