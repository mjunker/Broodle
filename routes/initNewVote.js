var express = require('express');
var state = require('./../application/actions/applicationStateProvider');

var router = express.Router();

router.get('/:group/:user', function (req, res, next) {
    var group = req.param("group");
    var username = req.param("user");
    var message = state.getState(group).voteState.onFindNewEvent(group, username);
    res.render('index', {title: message});
});

module.exports = router;

