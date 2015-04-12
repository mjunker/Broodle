var stateProvider = require('./../applicationStateProvider');
var voteTimeAccepter = require('../voteTimeAccepter');
var candidateStateAnalyzer = require('./../candidateStateAnalyzer');
var lookingForDayState = require('./lookingForDay');
var _ = require('lodash');


module.exports.onAcceptDayVote = function (group, username, votedDate, vote) {
    lookingForDayState.onAcceptDayVote(group, username, votedDate, vote);
}

module.exports.onAcceptTimeVote = function (group, username, date, vote) {
    var candidateDay = stateProvider.getCandidateDay(group, date);
    if (_.isUndefined(candidateDay)) {
        return 'Vote rejected. There is no vote pending for this day.'
    }
    var candidateTimeSlot = findCandidateTimeSlot(candidateDay, date);
    if (_.isUndefined(candidateTimeSlot)) {
        return 'Vote rejected. There is no vote pending for this time.'
    }

    if (candidateStateAnalyzer.isCandidateDayReadyForTimeVote(candidateDay)) {
        var voteRequest = {
            "group": group,
            "username": username,
            "candidateDay": candidateDay,
            "candidateTimeSlot": candidateTimeSlot,
            "date": date,
            "vote": vote
        };
        voteTimeAccepter.acceptVote(voteRequest);
        return 'Vote accepted.';
    }
    return 'Day has not yet been chosen. Cannot vote for time yet.';
}

module.exports.onCancel = function (group, username) {
    return 'Cannot cancel event. Different vote is still pending.';
}


function findCandidateTimeSlot(candidateDay, date) {
    return _.find(candidateDay.timeSlots, function (candidate) {
        return _.isEqual(candidate.timeSlot.start.hour(), date.hour())
            && _.isEqual(candidate.timeSlot.start.minute(), date.minute());
    });
}

