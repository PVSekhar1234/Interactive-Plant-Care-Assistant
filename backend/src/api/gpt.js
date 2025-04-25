const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  console.log("Received prompt:", prompt);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const result = await response.json();
    console.log("API response:", result);

    if (result.error) {
      console.log("Error in API response:", result.error);
      res.status(500).json({ error: 'Failed to fetch recommendation' });
      return;
    }

    const rawText = result?.choices?.[0]?.message?.content || 'Please try after sometime';
    console.log("Raw text before beautifying:", rawText);

    if (!rawText) {
      console.log("Raw text is empty or undefined.");
    } else {
      const beautified = rawText
  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Convert markdown bold to HTML <strong>
  .replace(/###\s/g, '<h3>')                       // Convert markdown headers (###) to <h3>
  .replace(/\n\n/g, '</h3><p>')                     // Double newline (two \n) => close h3, start new paragraph
  .replace(/\n/g, '<br>')                           // Single newline => <br> for line breaks
  .replace(/<\/h3><p><h3>/g, '</h3><p>')            // Remove unnecessary <h3><p> mix (if any)
  .replace(/<\/h3><p><br>/g, '</p><br>');           // Clean up if any empty <p> tags exist.

console.log("Beautified response:", beautified);
                          // Single newline => <br> for line breaks

      console.log("Beautified response:", beautified);
      res.json({ reply: beautified });
    }
  } catch (err) {
    console.error('Request failed:', err);
    res.status(500).json({ error: 'Failed to fetch recommendation' });
  }
});

module.exports = router;
