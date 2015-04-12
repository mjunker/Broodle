var config = require('../../config.json');
var _ = require('lodash');
var util = require('./util');
var state = require('./applicationStateProvider');
var voteDayPublisher = require('./voteDayPublisher');
var voteTimePublisher = require('./voteTimePublisher');
var candidateStateAnalyzer = require('./candidateStateAnalyzer');
var lookingForTimeState = require('./states/lookingForTime');

module.exports.acceptVote = function (group, username, date, vote) {
    var candidateDay = state.getCandidateDay(group, date);
    candidateDay.votes[username] = vote;
    if (_.isEqual(vote, 'no')) {
        handleNo(group, candidateDay, username);
    } else {
        handleYesOrMaybe(group, candidateDay);
    }
}

function handleNo(group, candidateDay, username) {
    // TODO MJU delay mail sending
    deleteCandidate(group, candidateDay);
    letUserVoteForNextCandidate(group, username);
}


function handleYesOrMaybe(group, candidateDay) {
    var candidates = state.getState(group).candidates;
    var candidateWithVoteCompletedSuccessfully = candidateStateAnalyzer.findCandidateWithAllPositiveVotes(candidates, group);
    if (_.isUndefined(candidateWithVoteCompletedSuccessfully)) {
        letNextUserVote(candidateDay, group);
    } else {
        tryToFinishDaySelection(group, candidateDay);
    }
}

function tryToFinishDaySelection(group, candidateDay) {
    if (candidateStateAnalyzer.allVotesAre(candidateDay, ['yes'])) {
        state.updateVoteState(group, lookingForTimeState);
        voteTimePublisher.initAndPublishTimeCandidates(group, candidateDay);
    } else {
        // TODO ask for confirmation on maybe date
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

function deleteCandidate(group, candidateDay) {
    // TODO don't delete - just deactivate
    state.getState(group).candidates = _.without(state.getState(group).candidates, candidateDay);
}



