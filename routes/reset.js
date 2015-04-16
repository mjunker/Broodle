var express = require('express');
var state = require('./../application/actions/applicationStateProvider');

var router = express.Router();

router.get('/:group', function (req, res, next) {
    var group = req.param("group");
    state.resetState(group);
    res.render('index', {title: 'Vote reset'});
});

module.exports = router;

