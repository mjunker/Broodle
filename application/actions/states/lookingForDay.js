var voteDayAccepter = require('../voteDayAccepter');
var state = require('./../applicationStateProvider');


module.exports.onAcceptDayVote = function (group, username, votedDate, vote) {
    voteDayAccepter.acceptVote(group, username, votedDate, vote);
    return 'Vote accepted: ' + votedDate;
}

module.exports.onAcceptTimeVote = function (group, username, votedDate, vote) {
    return 'Cannot vote for time. No day has been found yet.';

}

module.exports.onCancel = function (group, username) {
    return 'Cannot cancel event. Other vote is still pending.';
}