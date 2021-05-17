const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => res.send('I am alive'));

router.get('/config', (req, res) =>
  res.json({
    backend1: process.env.SERVICE_API1_ENDPOINT || 'http://localhost:19010/api',
  })
);

module.exports = router;
