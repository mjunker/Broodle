var util = require('./util');
var _ = require('lodash');

// TODO state pattern: lookingForDay, lookingForTime, done

var state = {};
module.exports.state = state;

function getState(group) {
    if (!state.hasOwnProperty(group)) {
        state[group] = {};
    }
    return state[group];
};

module.exports.getState = getState;

module.exports.resetState = function (group) {
    state[group] = {};
};

module.exports.getCandidateDay = function (group, date) {
    return _.find(getState(group).candidates, function (candidateDay) {
        return _.isEqual(candidateDay.day, util.formatAsDateString(date));
    })
}