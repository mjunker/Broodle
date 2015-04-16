var config = require('config');
var _ = require('lodash');
var util = require('./util');
var voteTimePublisher = require('./voteTimePublisher');
var candidateStateAnalyzer = require('./candidateStateAnalyzer');
var mailSender = require('./../../external/mail/mailSender');
var noVotePending = require('./states/noVotePending');
var state = require('./applicationStateProvider');
var moment = require('moment');

var delayInSeconds = config.get('delayTimeForEmails');


function detectNextUser(timeSlot, group, candidateDay) {
    var nextUser = util.findNextUserWithoutVote(timeSlot, config.get(group).members);

    if (_.isUndefined(nextUser)) {
        nextUser = candidateStateAnalyzer.findNextUserFromTimeSlotWithMostVotes(candidateDay.timeSlots, group);
    }
    return nextUser;
}
function scheduleEmailForNextUser(voteRequest) {
    var group = voteRequest.group;
    var timeSlot = voteRequest.candidateTimeSlot;
    var candidateDay = voteRequest.candidateDay;
    var nextUser = detectNextUser(timeSlot, group, candidateDay);
    if (_.isUndefined(nextUser)) {
        handleNoMoreTimeSlotsAvailable();
    } else {
        var scheduledTime = moment().add(delayInSeconds, 'second').toDate();
        state.setCurrentEmailJobForUser(voteRequest.group, nextUser.username, scheduledTime, function () {
            voteTimePublisher.publishPossibleTimeRanges(voteRequest.group,
                voteRequest.candidateDay, nextUser);
        });
    }

}
module.exports.acceptVote = function (voteRequest) {
    var timeSlot = voteRequest.candidateTimeSlot;
    timeSlot.votes[voteRequest.username] = voteRequest.vote;
    var group = voteRequest.group;
    var candidateDay = voteRequest.candidateDay;

    var successfulCandidate = candidateStateAnalyzer.findCandidateWithAllPositiveVotes(candidateDay.timeSlots, group);
    if (_.isUndefined(successfulCandidate)) {
        scheduleEmailForNextUser(voteRequest);
    } else {
        finishTimeSelection(group, successfulCandidate);
    }
}

function finishTimeSelection(group, candidate) {
    var recipients = '';
    _.forEach(config.get(group).members, function (member) {
        recipients += member.email + ',';
    });

    mailSender.sendMail(recipients, 'Bestätigung: Bandprobe am ' + candidate.timeSlot.start.format('DD.MM.YYYY HH:MM'), '');
    state.updateVoteState(group, noVotePending);
}


function handleNoMoreTimeSlotsAvailable() {
    // TODO go back to lookingForTime mode if there are still open days
}


