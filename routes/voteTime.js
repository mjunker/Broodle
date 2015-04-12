var express = require('express');
var state = require('./../application/actions/applicationStateProvider');
var util = require('./../application/actions/util');

var router = express.Router();

router.get('/:group/:user/:date/:vote', function (req, res) {
    var group = req.param("group");
    var username = req.param("user");
    var votedDate = req.param("date");
    var vote = req.param("vote");
    var date = util.parseDateTimeFromUrl(votedDate);

    var message = state.getState(group).voteState.onAcceptTimeVote(group, username, date, vote);
    res.render('index', {title: message});
});


module.exports = router;

