var config = require('config');
var _ = require('lodash');
var util = require('./util');
var state = require('./applicationStateProvider');


function hasOnlyPositiveVotes(candidate) {
    return allVotesAre(candidate, ['yes', 'maybe']);
}

function getMembersWhoVoted(group, candidate) {
    return _.filter(config.get(group).members, function (member) {
        return _.has(candidate.votes, member.username);
    });
}
function haveAllMembersVoted(candidate, group) {
    return _.isEqual(getMembersWhoVoted(group, candidate).length, config.get(group).members.length);
}

module.exports.findCandidateWithAllPositiveVotes = function (candidates, group) {
    return _.find(candidates, function (candidate) {
        return haveAllMembersVoted(candidate, group) &&
            hasOnlyPositiveVotes(candidate);
    });
}

function allVotesAre(candidate, voteOptions) {
    return _.isUndefined(_.find(candidate.votes, function (vote) {
        return !_.includes(voteOptions, vote);
    }));
}

function isCandidateDayReadyForTimeVote(candidateDay) {
    return _.has(candidateDay, 'timeSlots');
}

function hasUserVotedYesAtLeastOnce(candidates, user) {
    return !_.isUndefined(_.find(candidates, function (candidate) {
        return _.isEqual(candidate.votes[user], 'yes') || _.isEqual(candidate.votes[user], 'maybe');
    }));
}

function findNextUserFromTimeSlotWithMostVotes(candidates, group) {
    var candidateWithOpenVotes = _.filter(candidates, function (candidate) {
        return !haveAllMembersVoted(candidate, group);
    });

    var sorted = _.sortBy(candidateWithOpenVotes, function (candidate) {
        return getMembersWhoVoted(group, candidate).length;
    })
    sorted.reverse();
    if (sorted.length > 0) {
        return util.findNextUserWithoutVote(sorted[0], config.get(group).members);
    }
    return null;
}

module.exports.findNextUserFromTimeSlotWithMostVotes = findNextUserFromTimeSlotWithMostVotes;
module.exports.hasUserVotedYesAtLeastOnce = hasUserVotedYesAtLeastOnce;
module.exports.allVotesAre = allVotesAre;
module.exports.isCandidateDayReadyForTimeVote = isCandidateDayReadyForTimeVote;
module.exports.hasOnlyPositiveVotes = hasOnlyPositiveVotes;
module.exports.allVotesAre = allVotesAre;
module.exports.haveAllMembersVoted = haveAllMembersVoted;
