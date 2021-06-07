const express = require('express');
const Controller = require('./controller');
const model = require('./model');
const router = express.Router();

const controller = new Controller(model);

router.post('/', controller.insert.bind(controller));

module.exports = router;
