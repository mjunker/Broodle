var express = require('express');
var eventCandidateDetector = require('../application/actions/eventCandidateDetector');
var router = express.Router();

router.get('/', function (req, res, next) {
    eventCandidateDetector.cancelCurrentWeekEvent();
    res.render('index', {title: 'Event canceled'});
});

module.exports = router;

