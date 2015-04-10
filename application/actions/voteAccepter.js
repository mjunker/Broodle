var config = require('../../config.json');
var _ = require('lodash');
var util = require('./util');
var state = require('./applicationState');
var votePublisher = require('./votePublisher');


function getCandidateDay(group, date) {
    return state.getState(group).candidates[util.formatAsDateString(date)];
}
module.exports.acceptVote = function (group, username, votedDate, vote) {
    var date = util.parseDateFromUrl(votedDate);
    var candidateDay = getCandidateDay(group, date);
    var candidate = findCandidate(candidateDay, date);
    candidate[username] = vote;

    if (_.isEqual(vote, 'no')) {
        letUserVoteForNextCandidate();
    } else {
        letNextUserVoteForSameCandidate(candidate, group);
    }
}


function letUserVoteForNextCandidate() {
    var nextAvailableCandidate = votePublisher.selectNextAvailableCandidate(group, username);
    if (!_.isUndefined(nextAvailableCandidate)) {
        votePublisher.initVote(group, username, nextAvailableCandidate);
    } else {
        // no more choices available for user - check if other users have to vote
    }
}

function letNextUserVoteForSameCandidate(candidate, group) {
    var nextUser = findNextUserWithoutVote(candidate, config[group].members);
    if (!_.isUndefined(nextUser)) {
        votePublisher.initVote(group, nextUser.username, candidate);
    } else {
        // all users have voted for this candidate. check if done or if other events are still candidates
    }
}
function findCandidate(candidateDay, date) {
    var candidate = _.find(candidateDay.ranges, function (candidate) {
        return _.isEqual(candidate.start.hour(), date.hour()) && _.isEqual(candidate.start.minute(), date.minute());
    });
    return candidate;
}

function findNextUserWithoutVote(candidate, members) {
    return _.find(members, function (member) {
        return !candidate.hasOwnProperty(member.username);
    });
}