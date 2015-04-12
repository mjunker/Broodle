var eventCandidateDetector = require('../eventCandidateDetector');
var voteDayPublisher = require('../voteDayPublisher');
var state = require('./../applicationStateProvider');
var lookingForDayState = require('./lookingForDay');


module.exports.onAcceptDayVote = function (group, username, votedDate, vote) {
    return 'No Vote pending';
}

module.exports.onAcceptTimeVote = function (group, username, votedDate, vote) {
    return 'No Vote pending';
}

module.exports.onFindNewEvent = function (group, username) {
    eventCandidateDetector.findNewEvent(group, function () {
        state.updateVoteState(group, lookingForDayState);
        voteDayPublisher.initVote(group, username);
    });
    return 'Event canceled';
}