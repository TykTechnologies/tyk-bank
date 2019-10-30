var express = require('express');
var router = express.Router();
var loanController = require('../controllers/loan-controller')

router.get('/', loanController.loanRequest);

module.exports = router;
