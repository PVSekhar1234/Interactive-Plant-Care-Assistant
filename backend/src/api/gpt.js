// const express = require('express');
// const router = express.Router();
// const { OpenAI } = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// router.post('/generate', async (req, res) => {
//   const { prompt } = req.body;
//   console.log("Received prompt:", prompt); // Log the received prompt
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini", // or "gpt-4"
//       messages: [
//         { role: "system", content: "You are a helpful plant care assistant." },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.7,
//     });
//     console.log("Prompt sent to GPT:", prompt); // Log the prompt sent to GP
//      console.log("GPT response:", completion.choices[0].message.content); // Log the GPT response
//     res.json({ reply: completion.choices[0].message.content });
//   } catch (error) {
//     console.error("Error from OpenAI:", error);
//     res.status(500).json({ error: "Failed to generate GPT response" });
//   }
// });

// module.exports = router;
 const express = require('express');
const fetch =require('node-fetch');
const router = express.Router();

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
    console.log("Received prompt:", prompt); // Log the received prompt
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HG_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const result = await response.json();
    console.log("Hugging Face API response:", result); // Log the API response
    const generatedText = result?.[0]?.generated_text || 'No response';
const reply = generatedText.replace(prompt, '').trim();
    res.json({ reply });
  } catch (err) {
    console.error('Hugging Face API error:', err);
    res.status(500).json({ error: 'Failed to fetch recommendation' });
  }
});
 module.exports = router;
