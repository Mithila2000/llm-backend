const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint to handle requests from the frontend
app.post('/api/generate', async (req, res) => {
    const { prompt, modelName, apiBaseUrl, apiKey, maxTokens, temperature } = req.body;

    // Ensure the API Key is provided in the request
    if (!apiKey) {
        return res.status(400).json({ error: "API key is missing." });
    }

    try {
        // Call the OpenAI API with the provided parameters
        const response = await axios.post(
            `${apiBaseUrl}/v1/completions`,
            {
                model: modelName || 'gpt-3.5-turbo',
                messages: [{ role: "user", content: prompt }],
                max_tokens: maxTokens || 2000,
                temperature: temperature || 0.5,
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Check if the response is valid and return the generated text
        const generatedText = response.data.choices[0].message.content;
        res.json({ generatedText });

    } catch (error) {
        console.error("Error calling OpenAI API:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to generate response. Please try again later." });
    }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
