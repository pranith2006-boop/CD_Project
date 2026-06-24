// server/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from React build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Import compiler routes
const compilerRouter = require('./routes/compiler');
app.use('/api', compilerRouter);

// Fallback for SPA routing: serve index.html for all non-API paths
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
