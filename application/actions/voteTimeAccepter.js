var config = require('../../config.json');
var _ = require('lodash');
var util = require('./util');
var state = require('./applicationState');
var voteTimePublisher = require('./voteTimePublisher');
var candidateStateAnalyzer = require('./candidateStateAnalyzer');
var mailSender = require('./../../external/mail/mailSender');


module.exports.acceptVote = function (group, username, votedDate, vote) {
    var date = util.parseDateTimeFromUrl(votedDate);
    var candidateDay = _.find(state.getState(group).candidates, function (candidate) {
        return _.isEqual(util.formatAsDateString(date), candidate.day);
    });
    var candidateTimeSlot = findCandidateDay(candidateDay, date);
    if (!_.isUndefined(candidateTimeSlot)) {
        candidateTimeSlot.votes[username] = vote;
        var candidate = candidateStateAnalyzer.findCandidateWithAllPositiveVotes(candidateDay.timeSlots, group);
        if (_.isUndefined(candidate)) {
            letNextUserVote(group, candidateTimeSlot);
        } else {
            finishTimeSelection(group, candidate);
        }
    }
}

function finishTimeSelection(group, candidate) {
    var recipients = '';
    _.forEach(config[group].members, function (member) {
        recipients += member.email + ',';
    });

    var start = util.formatAsDateTimeString(candidate.timeSlot.start);
    mailSender.sendMail(recipients, 'Neuer Probetermin: ' + start, '');

}

function letNextUserVote(group, candidate) {
    var nextUser = util.findNextUserWithoutVote(candidate, config[group].members);
    if (!_.isUndefined(nextUser)) {
        voteTimePublisher.publishPossibleTimeRanges(group, candidate);
    }
}

function findCandidateDay(candidateDay, date) {
    if (!_.isUndefined(candidateDay)) {
        var candidate = findCandidateTimeSlot(candidateDay, date);
        if (!_.isUndefined(candidate)) {
            return candidate;
        }
    }
    return null;
}

function findCandidateTimeSlot(candidateDay, date) {
    var candidate = _.find(candidateDay.timeSlots, function (candidate) {
        return _.isEqual(candidate.timeSlot.start.hour(), date.hour())
            && _.isEqual(candidate.timeSlot.start.minute(), date.minute());
    });
    return candidate;
}
