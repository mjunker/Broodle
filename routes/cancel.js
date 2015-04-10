var express = require('express');
var eventCandidateDetector = require('../application/actions/eventCandidateDetector');
var votePublisher = require('../application/actions/votePublisher');
var router = express.Router();

router.get('/:group/:user', function (req, res, next) {
    var group = req.param("group");
    var username = req.param("user");
    eventCandidateDetector.findNewEvent(group, function (dateToVoteFor) {
        votePublisher.initVote(group, username, dateToVoteFor);
    });
    res.render('index', {title: 'Event canceled'});
});

module.exports = router;

