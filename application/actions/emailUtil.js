var _ = require('lodash');
var config = require('config');


module.exports.createLink = function (voteUrl, voteOption) {
    return '<a href="' + voteUrl + '" >' + voteOption + '</a>';
}

module.exports.createVoteUrl = function (voteMode, group, username, dateToVoteFor, vote) {
    return config.get('baseUrl') + 'vote/' + voteMode + '/' + group + "/" + username + "/" + dateToVoteFor + "/" + vote;
}

module.exports.createVoteInfoString = function (candidate) {
    var result = '';
    for (var username in candidate.votes) {
        if (_.has(candidate.votes, username)) {
            result += username + ": " + candidate.votes[username] + ', ';
        }
    }
    return result.substring(0, result.length - 2);
}