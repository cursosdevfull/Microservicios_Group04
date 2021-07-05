const express = require('express');
const router = require('./routes/api.route');
const cors = require('cors');
const app = express();

app.use(cors());
app.use('/api', router);

app.get('*', (req, res) => {
  console.log('backend2', req.url);
  res.send('Path not found');
});

module.exports = app;
