const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Read HTML file
const htmlPath = path.join(__dirname, 'netraleela_prompt_studio.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Serve HTML at root
app.get('/', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.send(htmlContent);
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
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
