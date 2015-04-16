var config = require('config');
var _ = require('lodash');
var util = require('./util');
var state = require('./applicationStateProvider');
var voteDayPublisher = require('./voteDayPublisher');
var voteTimePublisher = require('./voteTimePublisher');
var candidateStateAnalyzer = require('./candidateStateAnalyzer');
var lookingForTimeState = require('./states/lookingForTime');
var moment = require('moment');

var delayInSeconds = config.get('delayTimeForEmails');

module.exports.acceptVote = function (voteRequest) {
    var vote = voteRequest.vote;
    voteRequest.candidateDay.votes[voteRequest.username] = vote;
    if (_.isEqual(vote, 'no')) {
        handleNo(voteRequest);
    } else {
        handleYesOrMaybe(voteRequest);
    }
}

function scheduleReminderEmail(voteRequest) {
    var scheduledTime = moment().add(delayInSeconds, 'second').toDate();
    state.setCurrentEmailJobForUser(voteRequest.group, voteRequest.username, scheduledTime, function () {
        var candidates = state.getState(voteRequest.group).candidates;
        if (!candidateStateAnalyzer.hasUserVotedYesAtLeastOnce(candidates, voteRequest.user)) {
            letUserVoteForNextCandidate(voteRequest);
        }
    });
}

function handleNo(voteRequest) {
    deleteCandidate(voteRequest);
    scheduleReminderEmail(voteRequest);

}

function handleYesOrMaybe(voteRequest) {
    state.cancelExistingJob(voteRequest.group, voteRequest.username);
    var group = voteRequest.group;
    var candidateDay = voteRequest.candidateDay;
    var candidates = state.getState(group).candidates;
    var candidateWithVoteCompletedSuccessfully = candidateStateAnalyzer.findCandidateWithAllPositiveVotes(candidates, group);
    if (_.isUndefined(candidateWithVoteCompletedSuccessfully)) {
        scheduleMailForNextUser(voteRequest);
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


function scheduleMailForNextUser(voteRequest) {
    var group = voteRequest.group;

    var nextUser = candidateStateAnalyzer.findNextUserFromTimeSlotWithMostVotes(state.getState(group).candidates, group);

    if (!_.isUndefined(nextUser)) {
        var usernameNextUser = nextUser.username;

        // wait some time because the previous user could still be voting
        var scheduledTime = moment().add(delayInSeconds, 'second');
        state.setCurrentEmailJobForUser(group, usernameNextUser, scheduledTime.toDate(), function () {
            voteDayPublisher.initVote(group, usernameNextUser);
        });
    } else {
        // TODO
    }
}


function deleteCandidate(voteRequest) {
    // TODO don't delete - just deactivate
    state.getState(voteRequest.group).candidates =
        _.without(state.getState(voteRequest.group).candidates, voteRequest.candidateDay);
}



