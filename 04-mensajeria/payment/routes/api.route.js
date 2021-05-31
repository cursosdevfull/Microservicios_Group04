const express = require('express');
const sendMessage = require('../queue');
const router = express.Router();

router.get('/health', (req, res) => res.send('I am alive'));

router.post('/payment', async (req, res) => {
  const { token, amount, name, email } = req.body;

  setTimeout(() => {
    sendMessage({ token, amount, name, email });
    res.send('Pago procesado');
  }, 3000);
});

module.exports = router;
