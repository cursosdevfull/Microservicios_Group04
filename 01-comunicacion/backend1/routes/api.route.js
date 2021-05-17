const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/health', (req, res) => res.send('I am alive'));

router.get('/message', async (req, res) => {
  const pathBackend2 =
    process.env.SERVICE_API2_ENDPOINT || 'http://localhost:19020/api';

  const response = await axios.get(pathBackend2 + '/message');
  const messageBackend2 = response.data.message;

  res.json({
    messageBackend1: 'Message from backend1',
    messageBackend2,
  });
});

module.exports = router;
