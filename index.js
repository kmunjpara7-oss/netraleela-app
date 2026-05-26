const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve HTML file at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'netraleela_prompt_studio.html'));
});

// API endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { apiKey, systemPrompt, messages } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'API key missing' });
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4.5-20241022',
        max_tokens: 4000,
        system: systemPrompt,
        messages: messages
      })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
