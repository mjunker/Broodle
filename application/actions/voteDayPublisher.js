var mailSender = require('./../../external/mail/mailSender');
var _ = require('lodash');
var util = require('./util');
var stateProvider = require('./applicationStateProvider');
var emailUtil = require('./emailUtil');

module.exports.initVote = function (group, username) {
    var candidates = stateProvider.getState(group).candidates;
    var receiverEmail = util.findUserByUserName(group, username).email;
    var subject = username + ": Bandprobe abgesagt! Neuen Tag suchen!";
    var message = createMessage(group, username, candidates);
    mailSender.sendMail(receiverEmail, subject, message);
}

function createTimeFromRanges(ranges) {
    var time = '';
    var format = 'HH';

    _.forEach(ranges, function (range) {
        time += range.start.format(format) + '-' + range.end.format(format) + ' '
    });
    return time;

}
function createMessageForDayCandidate(group, username, candidate) {
    var dayString = candidate.ranges[0].start.format('dddd, D.M');
    var message = '';
    message += dayString + ': ' + createTimeFromRanges(candidate.ranges);
    // TODO maybe
    _.forEach(['yes', 'no'], function (voteOption) {
        var voteUrl = emailUtil.createVoteUrl('day', group, username, candidate.day, voteOption);
        message += emailUtil.createLink(voteUrl, voteOption) + ' ';
    });

    var voteInfoString = emailUtil.createVoteInfoString(candidate);
    if (!_.isEmpty(voteInfoString)) {
        message = message + ' (' +  voteInfoString + ')';

    }
    return message;
}

function createMessage(group, username, candidates) {
    var message = '';
    _.forEach(candidates, function (candidate) {
        message += createMessageForDayCandidate(group, username, candidate) + '<br>';
    });

    return message;
}
