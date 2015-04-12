var config = require('../../config.json');
var _ = require('lodash');
var util = require('./util');
var voteTimePublisher = require('./voteTimePublisher');
var candidateStateAnalyzer = require('./candidateStateAnalyzer');
var mailSender = require('./../../external/mail/mailSender');
var noVotePending = require('./states/noVotePending');
var state = require('./applicationStateProvider');


module.exports.acceptVote = function (voteRequest) {
    var timeSlot = voteRequest.candidateTimeSlot;
    timeSlot.votes[voteRequest.username] = voteRequest.vote;
    var group = voteRequest.group;
    var candidateDay = voteRequest.candidateDay;

    var successfulCandidate = candidateStateAnalyzer.findCandidateWithAllPositiveVotes(candidateDay.timeSlots, group);
    if (_.isUndefined(successfulCandidate)) {
        letNextUserVote(group, candidateDay, timeSlot);
    } else {
        finishTimeSelection(group, successfulCandidate);
    }
}

function finishTimeSelection(group, candidate) {
    var recipients = '';
    _.forEach(config[group].members, function (member) {
        recipients += member.email + ',';
    });

    var start = util.formatAsDateTimeString(candidate.timeSlot.start);
    mailSender.sendMail(recipients, 'Neuer Probetermin: ' + start, '');
    state.updateVoteState(group, noVotePending);


}

function findNextUserFromTimeSlotWithMostVotes(candidateDay) {
    // TODO implement
}
function handleNoMoreTimeSlotsAvailable() {
    // TODO go back to lookingForTime mode if there are still open days
}
function letNextUserVote(group, candidateDay, timeSlot) {
    var nextUser = util.findNextUserWithoutVote(timeSlot, config[group].members);
    if (_.isUndefined(nextUser)) {
        nextUser = findNextUserFromTimeSlotWithMostVotes(candidateDay);
    }
    if (_.isUndefined(nextUser)) {
        handleNoMoreTimeSlotsAvailable();
    } else {
        voteTimePublisher.publishPossibleTimeRanges(group, candidateDay, timeSlot);
    }
}


