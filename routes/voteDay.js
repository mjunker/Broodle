var express = require('express');
var voteDayAccepter = require('../application/actions/voteDayAccepter');

var router = express.Router();

router.get('/:group/:user/:date/:vote', function (req, res) {
    var group = req.param("group");
    var username = req.param("user");
    var votedDate = req.param("date");
    var vote = req.param("vote");
    voteDayAccepter.acceptVote(group, username, votedDate, vote);
    res.render('index', {title: 'Vote accepted!'});

});


module.exports = router;

