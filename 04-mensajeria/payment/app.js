const express = require('express');
const router = require('./routes/api.route');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.get('*', (req, res) => {
  res.send('Path not found');
});

module.exports = app;
