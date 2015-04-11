var mailSender = require('./../../external/mail/mailSender');
var config = require('../../config.json');
var _ = require('lodash');
var util = require('./util');
var stateProvider = require('./applicationState');
var emailUtil = require('./emailUtil');

module.exports.initVote = function (group, username) {
    var candidates = stateProvider.getState(group).candidates;
    var receiverEmail = util.findUserByUserName(group, username).email;
    var subject = username + ": Bandprobe abgesagt!!!! Neuer Tag suchen!!!";
    var message = createMessage(group, username, candidates);
    mailSender.sendMail(receiverEmail, subject, message);
}

function createMessageForDayCandidate(group, username, candidate) {
    var message = candidate.day + ' (' + emailUtil.createVoteInfoString(candidate) + '): ';
    _.forEach(['yes', 'no', 'maybe'], function (voteOption) {
        var voteUrl = emailUtil.createVoteUrl('day', group, username, candidate.day, voteOption);
        message += emailUtil.createLink(voteUrl, voteOption) + ' ';
    });
    return message;
}

function createMessage(group, username, candidates) {
    var message = '';
    _.forEach(candidates, function (candidate) {
        message += createMessageForDayCandidate(group, username, candidate) + '<br>';
    });

    return message;
}
