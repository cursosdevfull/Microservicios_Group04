const express = require('express');
const routes = require('./routes');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/order', routes);

app.get('/health', (req, res) => {
  res.send('I am alive');
});

app.use((req, res) => {
  res.send('Path not found');
});

module.exports = app;
