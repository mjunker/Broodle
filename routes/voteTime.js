var express = require('express');
var voteTimeAccepter = require('../application/actions/voteTimeAccepter');

var router = express.Router();

router.get('/:group/:user/:date/:vote', function (req, res) {
    var group = req.param("group");
    var username = req.param("user");
    var votedDate = req.param("date");
    var vote = req.param("vote");
    voteTimeAccepter.acceptVote(group, username, votedDate, vote);
    res.render('index', {title: 'Vote accepted!'});

});


module.exports = router;

