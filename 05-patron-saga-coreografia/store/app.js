const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.send('I am alive');
});

app.use((req, res) => {
  res.send('Path not found');
});

module.exports = app;
