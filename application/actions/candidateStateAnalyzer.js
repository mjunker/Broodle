var config = require('../../config.json');
var _ = require('lodash');
var util = require('./util');
var state = require('./applicationStateProvider');


function hasOnlyPositiveVotes(candidate) {
    return allVotesAre(candidate, ['yes', 'maybe']);
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

module.exports.allVotesAre = allVotesAre;
module.exports.isCandidateDayReadyForTimeVote = isCandidateDayReadyForTimeVote;
module.exports.hasOnlyPositiveVotes = hasOnlyPositiveVotes;
module.exports.allVotesAre = allVotesAre;
module.exports.haveAllMembersVoted = haveAllMembersVoted;
