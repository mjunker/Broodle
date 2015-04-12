var config = require('config');
var _ = require('lodash');
var util = require('./util');
var state = require('./applicationStateProvider');
var voteDayPublisher = require('./voteDayPublisher');
var voteTimePublisher = require('./voteTimePublisher');
var candidateStateAnalyzer = require('./candidateStateAnalyzer');
var lookingForTimeState = require('./states/lookingForTime');

module.exports.acceptVote = function (voteRequest) {
    var vote = voteRequest.vote;
    voteRequest.candidateDay.votes[voteRequest.username] = vote;
    if (_.isEqual(vote, 'no')) {
        handleNo(voteRequest);
    } else {
        handleYesOrMaybe(voteRequest);
    }
}

function handleNo(voteRequest) {
    // TODO MJU delay mail sending
    deleteCandidate(voteRequest);
    letUserVoteForNextCandidate(voteRequest);
}


function handleYesOrMaybe(voteRequest) {
    var group = voteRequest.group;
    var candidateDay = voteRequest.candidateDay;
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


function letUserVoteForNextCandidate(voteRequest) {
    voteDayPublisher.initVote(voteRequest.group, voteRequest.username);
    // TODO no more choices available for user - check if other users have to voteDay
}

function letNextUserVote(candidate, group) {
    var nextUser = util.findNextUserWithoutVote(candidate, config.get(group).members);
    if (!_.isUndefined(nextUser)) {
        voteDayPublisher.initVote(group, nextUser.username);
    }
}

function deleteCandidate(voteRequest) {
    // TODO don't delete - just deactivate
    state.getState(voteRequest.group).candidates =
        _.without(state.getState(voteRequest.group).candidates, voteRequest.candidateDay);
}



