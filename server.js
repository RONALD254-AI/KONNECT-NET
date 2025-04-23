const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Optional root route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/store-code', (req, res) => {
  const code = req.body.code;
  if (!code) {
    return res.status(400).json({ error: 'No code received' });
  }

  const filePath = path.join(__dirname, 'codes.txt');
  const timestamp = new Date().toISOString();
  const entry = `${timestamp} - Code: ${code}\n`;

  fs.appendFile(filePath, entry, (err) => {
    if (err) {
      console.error('Error saving code:', err);
      return res.status(500).json({ error: 'Failed to save code' });
    }
    console.log('Code saved:', code);
    res.status(200).json({ status: 'success' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
