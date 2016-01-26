var express = require('express');
var router = express.Router();
var modelHtml = require('../models/model_html');

router.get('/', function(req, res, next) {
    res.render('index', modelHtml.getModel('index_html'));
});

module.exports = router;
