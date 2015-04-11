var mailSender = require('./../../external/mail/mailSender');
var config = require('../../config.json');
var _ = require('lodash');
var util = require('./util');
var stateProvider = require('./applicationState');
var emailUtil = require('./emailUtil');

module.exports.initVote = function (group, username) {
    var candidates = stateProvider.getState(group).candidates;
    var receiverEmail = util.findUserByUserName(group, username).email;
    var subject = username + ": Bandprobe abgesagt! Neuer Tag suchen!";
    var message = createMessage(group, username, candidates);
    mailSender.sendMail(receiverEmail, subject, message);
}

function createTimeFromRanges(ranges) {
    var time = '';
    var format = 'HH:mm';

    _.forEach(ranges, function (range) {
        time += range.start.format(format) + '-' + range.end.format(format) + ' '
    });
    return time;

}
function createMessageForDayCandidate(group, username, candidate) {
    var message = candidate.day + ': ' + createTimeFromRanges(candidate.ranges);
    _.forEach(['yes', 'no', 'maybe'], function (voteOption) {
        var voteUrl = emailUtil.createVoteUrl('day', group, username, candidate.day, voteOption);
        message += emailUtil.createLink(voteUrl, voteOption) + ' ';
    });
    return message + ' (' + emailUtil.createVoteInfoString(candidate) + ');';
}

function createMessage(group, username, candidates) {
    var message = '';
    _.forEach(candidates, function (candidate) {
        message += createMessageForDayCandidate(group, username, candidate) + '<br>';
    });

    return message;
}
