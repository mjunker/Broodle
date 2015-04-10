var express = require('express');
var gcalLoader = require('./../external/google_calendar/gcal_loader');
var router = express.Router();

router.get('/', function (req, res, next) {
    gcalLoader.load(function (err, res, body) {
        console.log(JSON.parse(body));
    });

    res.render('index', {title: 'Express'});
});

module.exports = router;

