const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Allow Netlify origin
app.use(cors({
  origin: ['https://hostaway-api.netlify.app', 'http://localhost:3000']
  
}));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Root route - send index.html
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Optional test route
app.get('/ping', (_, res) => {
  res.send('pong');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
