var mailSender = require('./../../external/mail/mailSender');
var config = require('../../config.json');
var _ = require('lodash');
var util = require('./util');
var emailUtil = require('./emailUtil');
var stateProvider = require('./applicationState');
var moment = require('moment');
var momentRange = require('moment-range');
var mailSender = require('./../../external/mail/mailSender');


function findNextUser(candidateDay, group) {

    return util.findNextUserWithoutVote(candidateDay, config[group].members);
}
function publishPossibleTimeRanges(group, candidateDay, timeSlot) {
    var candidates = candidateDay.timeSlots;
    var user = findNextUser(timeSlot, group);
    var receiverEmail = user.email;

    var subject = user.username + ": Tag gefunden!!!! Zeit auswählen!!!";
    var message = createMessageForTimeCandidates(group, user.username, candidates);
    mailSender.sendMail(receiverEmail, subject, message);
}

function initAndPublishTimeCandidates(group, candidateDay) {
    candidateDay.timeSlots = createPossibleTimeSlots(group, candidateDay);
    publishPossibleTimeRanges(group, candidateDay, candidateDay.timeSlots[0]);
}


function createMessageForTimeCandidate(group, username, dateToVoteFor) {
    var message = dateToVoteFor.timeSlot.start.format('DD.MM.YYYY HH:MM') + ': ';
    _.forEach(['yes', 'no'], function (voteOption) {
        var dateAsString = dateToVoteFor.timeSlot.start.format('YYYY-MM-DD-HH-MM');
        var voteUrl = emailUtil.createVoteUrl('time', group, username, dateAsString, voteOption);
        message += emailUtil.createLink(voteUrl, voteOption) + ' ';
    });
    return message + '<br>';
}

function createMessageForTimeCandidates(group, username, candidates) {
    var message = '';
    _.forEach(candidates, function (candidate) {
        message += createMessageForTimeCandidate(group, username, candidate);
    });
    return message;
}

function createPossibleTimeSlots(group, candidateDay) {
    var timeSlots = [];
    _.forEach(candidateDay.ranges, function (initialRange) {
        for (var currentTime = initialRange.start; currentTime.isBefore(initialRange.end); currentTime.add(1, 'hour')) {
            var timeSlotFrom = currentTime.clone();
            var timeSlotTo = currentTime.clone().add(config[group].minDurationInHours, 'hour');
            var timeSlotRange = moment().range(timeSlotFrom, timeSlotTo);
            if (initialRange.contains(timeSlotRange)) {
                timeSlots.push({"timeSlot": timeSlotRange, "votes": {}});
            }
        }
    });
    return timeSlots;
}

module.exports.initAndPublishTimeCandidates = initAndPublishTimeCandidates;
module.exports.publishPossibleTimeRanges = publishPossibleTimeRanges;