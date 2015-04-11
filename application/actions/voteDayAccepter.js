var config = require('../../config.json');
var _ = require('lodash');
var util = require('./util');
var state = require('./applicationState');
var voteDayPublisher = require('./voteDayPublisher');
var voteTimePublisher = require('./voteTimePublisher');


function getCandidateDay(group, date) {
    return _.find(state.getState(group).candidates, function (candidateDay) {
        return _.isEqual(candidateDay.day, util.formatAsDateString(date));
    })
}
function deleteCandidate(group, candidateDay) {
    state.getState(group).candidates = _.without(state.getState(group).candidates, candidateDay);
}
function allVotesMatch(candidate, voteOptions) {
    return _.isUndefined(_.find(candidate.votes, function (vote) {
        return !_.includes(voteOptions, vote);
    }));
}
function hasOnlyPositiveVotes(candidate) {
    return allVotesMatch(candidate, ['yes', 'maybe']);
}
function haveAllMembersVoted(candidate, group) {

    var haveAllVoted = true;
    _.forEach(config[group].members, function (member) {
        if (!_.has(candidate.votes, member.username)) {
            haveAllVoted = false;
        }
    });
    return haveAllVoted;
}

function findCandidateWithAllPositiveVotes(group) {
    return _.find(state.getState(group).candidates, function (candidate) {
        return haveAllMembersVoted(candidate, group) &&
            hasOnlyPositiveVotes(candidate);
    });
}


function tryToFinishDaySelection(group, candidateDay) {
    if (allVotesMatch(candidateDay, ['yes'])) {
        voteTimePublisher.initAndPublishTimeCandidates(group, candidateDay);
    } else {
        // TODO

    }
}
function handleYesOrMaybe(group, candidateDay) {
    var candidateWithVoteCompletedSuccessfully = findCandidateWithAllPositiveVotes(group);
    if (_.isUndefined(candidateWithVoteCompletedSuccessfully)) {
        letNextUserVote(candidateDay, group);
    } else {
        tryToFinishDaySelection(group, candidateDay);
    }
}
function handleNo(group, candidateDay, username) {
    deleteCandidate(group, candidateDay);
    letUserVoteForNextCandidate(group, username);
}
module.exports.acceptVote = function (group, username, votedDate, vote) {
    var date = util.parseDateFromUrl(votedDate);
    var candidateDay = getCandidateDay(group, date);
    candidateDay.votes[username] = vote;


    if (_.isEqual(vote, 'no')) {
        handleNo(group, candidateDay, username);
    } else {
        handleYesOrMaybe(group, candidateDay);
    }
}


function letUserVoteForNextCandidate(group, username) {
    voteDayPublisher.initVote(group, username);
    // TODO no more choices available for user - check if other users have to voteDay
}

function letNextUserVote(candidate, group) {
    var nextUser = util.findNextUserWithoutVote(candidate, config[group].members);
    if (!_.isUndefined(nextUser)) {
        voteDayPublisher.initVote(group, nextUser.username);
    }
}
function findCandidate(candidateDay, date) {
    var candidate = _.find(candidateDay.ranges, function (candidate) {
        return _.isEqual(candidate.start.hour(), date.hour())
            && _.isEqual(candidate.start.minute(), date.minute());
    });
    return candidate;
}

