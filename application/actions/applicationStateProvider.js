var util = require('./util');
var _ = require('lodash');
var noVotePendingState = require('./states/noVotePending');
var schedule = require('node-schedule');

var state = {};

function createInitialState() {
    return {"voteState": noVotePendingState, "mailQueue": {}};
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

function cancelExistingJob(group, username) {
    if (_.has(getState(group).mailQueue, username)
        && !_.isUndefined(getState(group).mailQueue[username])) {
        getState(group).mailQueue[username].cancel();
    }
}
function setCurrentEmailJobForUser(group, username, date, sendFunction) {
    var job = schedule.scheduleJob(date, function () {
        sendFunction();
    });
    cancelExistingJob(group, username);
    getState(group).mailQueue[username] = job;

}

module.exports.setCurrentEmailJobForUser = setCurrentEmailJobForUser;
module.exports.cancelExistingJob = cancelExistingJob;
module.exports.state = state;
module.exports.getState = getState;
