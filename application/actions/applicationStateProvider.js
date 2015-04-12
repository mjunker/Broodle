var util = require('./util');
var _ = require('lodash');
var noVotePendingState = require('./states/noVotePending');

var state = {};
module.exports.state = state;

function createInitialState() {
    return {"voteState": noVotePendingState};
}
function getState(group) {
    if (!state.hasOwnProperty(group)) {
        state[group] = createInitialState();
    }
    return state[group];
};
module.exports.updateVoteState = function (group, newVoteState) {
    state[group].voteState = newVoteState;
};

module.exports.resetState = function (group) {
    state[group] = createInitialState();
};

module.exports.getCandidateDay = function (group, date) {
    return _.find(getState(group).candidates, function (candidateDay) {
        return _.isEqual(candidateDay.day, util.formatAsDateString(date));
    })
}

module.exports.getState = getState;
