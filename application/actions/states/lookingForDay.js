var voteDayAccepter = require('../voteDayAccepter');
var state = require('./../applicationStateProvider');
var _ = require('lodash');


module.exports.onAcceptDayVote = function (group, username, votedDate, vote) {
    var candidateDay = state.getCandidateDay(group, votedDate);
    if (_.isUndefined(candidateDay)) {
        return 'Vote rejected. There is no vote pending for this day.'
    }
    var voteRequest = {
        "candidateDay": candidateDay,
        "group": group,
        "username": username,
        "votedDate": votedDate,
        "vote": vote
    }
    voteDayAccepter.acceptVote(voteRequest);
    return 'Vote accepted.';
}

module.exports.onAcceptTimeVote = function (group, username, votedDate, vote) {
    return 'Cannot vote for time. No day has been found yet.';

}

module.exports.onFindNewEvent = function (group, username) {
    return 'Cannot cancel event. Other vote is still pending.';
}