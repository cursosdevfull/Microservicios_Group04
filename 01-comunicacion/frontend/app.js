const express = require('express');
const router = require('./routes/api.route');
const app = express();

app.use('/', express.static(__dirname + '/public'));

app.use('/api', router);

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

module.exports = app;
