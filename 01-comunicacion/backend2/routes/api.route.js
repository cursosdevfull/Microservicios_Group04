const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => res.send('I am alive'));

router.get('/message', (req, res) =>
  res.json({
    message: 'Message from backend2',
  })
);

module.exports = router;
