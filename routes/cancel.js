var express = require('express');
var eventCandidateDetector = require('../application/actions/eventCandidateDetector');
var voteDayPublisher = require('../application/actions/voteDayPublisher');
var router = express.Router();

router.get('/:group/:user', function (req, res, next) {
    var group = req.param("group");
    var username = req.param("user");
    eventCandidateDetector.findNewEvent(group, function () {
        voteDayPublisher.initVote(group, username);
    });
    res.render('index', {title: 'Event canceled'});
});

module.exports = router;

